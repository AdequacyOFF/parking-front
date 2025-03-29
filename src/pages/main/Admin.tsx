import React from "react";
import block from "bem-cn-lite";
import {
  Button,
  Icon,
  Spin,
  Table,
  useToaster,
  withTableActions,
  TextInput,
} from "@gravity-ui/uikit";
import { PrimaryButton } from "../../components/button";
import "./Admin.scss";
import { Layout } from "../../components/layout";

import { useLocationParams } from "../../hooks/use-params";
import { useBindNavigator } from "../../hooks/use-navigator";
import { CircleXmarkFill, Pencil, Plus, TrashBin } from "@gravity-ui/icons";
import { Box, Stack, TablePagination } from "@mui/material";
import {
  useCreatePromotionMutation,
  useDeletePromotionMutation,
  useLazyGetPromotionsQuery,
  useUpdatePromotionMutation,
} from "../../store/api/admin";
import { TablePaginationActions } from "../../components/pagination";
import { formatDate } from "../../utils/date";
import {
  CreatePromotionPostParams,
  UpdatePromotionPostParams,
} from "../../store/api/admin/types/request";
import { CreateOrUpdateFormModal } from "./ui/create-promotion-modal";
import { ImgWrapper } from "../../components/img-wrapper";

const b = block("main-page");

const PromotionTable = withTableActions(Table);

const columns = [
  {
    id: "id",
    name: "ID",
    template: (item: any, _: number) => item.id.split("-")[0],
  },
  {
    id: "title",
    name: "Название",
    template: (item: any, _: number) => item.title || undefined,
  },
  {
    id: "photo",
    name: "Фото",
    template: (item: any, _: number) => (
      <ImgWrapper src={item.photo} height={40} width={40} />
    ),
  },
  {
    id: "shortDescription",
    name: "Описание",
    className: "description",
    template: (item: any, _: number) => item.shortDescription || undefined,
  },
  {
    id: "startDate",
    name: "Дата создания",
    template: (item: any, _: number) => formatDate(item.startDate),
  },
  {
    id: "endDate",
    name: "Дата окончания",
    template: (item: any, _: number) => formatDate(item.endDate),
  },
];

const TAG_ROWS_PER_PAGE = 10;

export const AdminPage: React.FC = () => {
  const { add } = useToaster();
  const { addToNavigateBar } = useBindNavigator<any>();
  const { params } = useLocationParams<any>(window.location.search);

  const [getPromotions, { data, ...getPromotionsRequestInfo }] =
    useLazyGetPromotionsQuery();

  const [updatePromotion, { ...updatePromotionRequestInfo }] =
    useUpdatePromotionMutation();

  const [createPromotions, { ...createPromotionsRequestInfo }] =
    useCreatePromotionMutation();

  const [deletePromotions] = useDeletePromotionMutation();

  const [page, setPage] = React.useState(
    params.page ? parseInt(params.page) : 1
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(
    params.rows ? parseInt(params.rows) : TAG_ROWS_PER_PAGE
  );

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [openCreatePromotionModal, setOpenCreatePromotionModal] =
    React.useState(false);
  const closeCreatePromotionModal = React.useCallback(() => {
    setOpenCreatePromotionModal(false);
  }, []);
  const handleCreatePromotionClick = () => {
    setOpenCreatePromotionModal(true);
  };
  const handleAddCreatePromotionClick = () => {
    setSelectedId(null);
    handleCreatePromotionClick();
  };
  const handleOnAddPromotionFormModalSubmit = (
    params: CreatePromotionPostParams
  ) => {
    createPromotions(params);
  };
  const handleOnUpdatePromotionFormModalSubmit = (
    params: UpdatePromotionPostParams
  ) => {
    updatePromotion(params);
  };

  const getRowActions = () => {
    return [
      {
        text: "Изменить",
        handler: (item: any) => {
          setSelectedId(item.id);
          handleCreatePromotionClick();
        },
        icon: <Icon data={Pencil} size={16} />,
      },
      {
        text: "Удалить",
        handler: (item: any) => deletePromotions(item.id),
        theme: "danger",
        icon: <Icon data={TrashBin} size={16} />,
      },
    ];
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage + 1);
    addToNavigateBar({
      ...params,
      page: newPage + 1,
    });

    getPromotions({
      ...params,
      limit: rowsPerPage,
      offset: newPage * rowsPerPage,
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const limit = parseInt(event.target.value, 10);
    setRowsPerPage(limit);
    setPage(1);
    addToNavigateBar({
      ...params,
      page: 1,
      rows: limit,
    });

    getPromotions({
      ...params,
      limit: limit,
      offset: 0,
    });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      await getPromotions({
        ...params,
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
      });
    };

    fetchData();

    addToNavigateBar({
      ...params,
      rows: rowsPerPage,
      page: page,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.rows, params.page, rowsPerPage, page]);

  React.useEffect(() => {
    if (getPromotionsRequestInfo.isError) {
      add({
        name: "generate-tag-success",
        autoHiding: 3000,
        isClosable: true,
        title: `Ошибка в запросе`,
        renderIcon: () => (
          <Icon className="success-red" data={CircleXmarkFill} size={18} />
        ),
        // @ts-ignore
        content: getPromotionsRequestInfo.error.error.message,
      });
    }
  }, [getPromotionsRequestInfo.isError, getPromotionsRequestInfo.error, add]);

  React.useEffect(() => {
    if (updatePromotionRequestInfo.isError) {
      add({
        name: "generate-tag-success",
        autoHiding: 3000,
        isClosable: true,
        title: `Ошибка в запросе`,
        renderIcon: () => (
          <Icon className="success-red" data={CircleXmarkFill} size={18} />
        ),
        // @ts-ignore
        content: updatePromotionRequestInfo.error.error.message,
      });
    }
  }, [
    updatePromotionRequestInfo.isError,
    updatePromotionRequestInfo.error,
    add,
  ]);

  React.useEffect(() => {
    if (updatePromotionRequestInfo.isSuccess) {
      closeCreatePromotionModal();
    }
  }, [updatePromotionRequestInfo.isSuccess, closeCreatePromotionModal]);

  React.useEffect(() => {
    if (createPromotionsRequestInfo.isError) {
      add({
        name: "generate-tag-success",
        autoHiding: 3000,
        isClosable: true,
        title: `Ошибка в запросе`,
        renderIcon: () => (
          <Icon className="success-red" data={CircleXmarkFill} size={18} />
        ),
        // @ts-ignore
        content: createPromotionsRequestInfo.error.error.message,
      });
    }
  }, [
    createPromotionsRequestInfo.isError,
    createPromotionsRequestInfo.error,
    add,
  ]);

  React.useEffect(() => {
    if (createPromotionsRequestInfo.isSuccess) {
      closeCreatePromotionModal();
    }
  }, [createPromotionsRequestInfo.isSuccess, closeCreatePromotionModal]);

  const totalItems = data?.result.total || 0;
  const promotions = data?.result.promotions || [];

  const [parkingSpacesCount, setParkingSpacesCount] = React.useState<string>("");
  const [isInitialSetupDone, setIsInitialSetupDone] = React.useState<boolean>(false);

  const handleCreateParkingSpaces = () => {
    const count = parseInt(parkingSpacesCount);
    if (count > 0) {
      // Здесь должна быть логика создания парковочных мест
      setIsInitialSetupDone(true);
      add({
        name: "parking-spaces-created",
        title: `Создано ${count} парковочных мест`,
        autoHiding: 3000,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setParkingSpacesCount(value);
    }
  };

  if (!isInitialSetupDone && (!data || data.result.total === 0)) {
    return (
      <Layout>
        <div className={b()}>
          <div className={b("initial-setup")}>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <span className={b("title")}>СОЗДАЙТЕ ПАРКОВКУ</span>
            </Stack>
            <div className={b("setup-form")}>
              <TextInput
                type="text"
                value={parkingSpacesCount}
                onChange={handleInputChange}
                size = "xl"
                className={b("input")}
              />
              <PrimaryButton
                view="action"
                size="xl"
                onClick={handleCreateParkingSpaces}
                disabled={!parkingSpacesCount || parseInt(parkingSpacesCount) <= 0}
                className={b("setup-button")}
                style={{ marginTop: 20, color: "#ffffff" }}
              >
                СОЗДАТЬ
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={b()}>
        <div className={b("table-container")}>
          <div className={b("table-wrapper")}>
            {getPromotionsRequestInfo.isFetching ? (
              <Box className={b("loading")}>
                <Spin />
              </Box>
            ) : null}

            <PromotionTable
              data={promotions}
              columns={columns}
              // @ts-ignore
              getRowActions={getRowActions}
              className={b("tag-table")}
              width="max"
              emptyMessage="Данных нет"
            />

            <Stack
              width="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                pl: 3,
              }}
            >
              <Button
                view="outlined-danger"
                size="xl"
                onClick={handleAddCreatePromotionClick}
              >
                Добавить
                <Icon data={Plus} size={18} />
              </Button>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={3}
                count={totalItems}
                rowsPerPage={rowsPerPage}
                page={page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                labelRowsPerPage={
                  <p className="fs15-secondary-thin">Строк на странице:</p>
                }
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} из ${count}`
                }
                sx={{
                  "& .MuiToolbar-root": {
                    p: 4,
                  },
                  "& *": {
                    fontFamily: "inherit",
                    color: "white",
                  },
                }}
              />
            </Stack>
          </div>
        </div>
      </div>

      {openCreatePromotionModal ? (
        <CreateOrUpdateFormModal
          open={openCreatePromotionModal}
          promotionId={selectedId}
          onClose={closeCreatePromotionModal}
          onCreate={handleOnAddPromotionFormModalSubmit}
          onUpdate={handleOnUpdatePromotionFormModalSubmit}
        />
      ) : null}
    </Layout>
  );
};
