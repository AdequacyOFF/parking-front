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
import { Pencil, Plus, TrashBin } from "@gravity-ui/icons";
import { Box, Stack, TablePagination } from "@mui/material";
import {
  useCreatePlaceMutation,
  useDeletePlaceMutation,
  useLazyGetPlacesQuery,
  useUpdatePlaceMutation,
  useCreateParkingMutation,
} from "../../store/api/admin";
import { TablePaginationActions } from "../../components/pagination";
import { formatDate } from "../../utils/date";
import { CreateOrUpdateFormModal } from "./ui/create-place-modal";
import type { TableActionConfig } from '@gravity-ui/uikit';

const b = block("main-page");

const PlacesTable = withTableActions(Table);

const columns = [
  {
    id: "placeId",
    name: "ID места",
    template: (item: any) => item.placeId,
  },
  {
    id: "owner",
    name: "Владелец",
    template: (item: any) => `${item.lastName} ${item.firstName} ${item.patronymic || ''}`,
  },
  {
    id: "ownerId",
    name: "ID владельца",
    template: (item: any) => item.ownerId,
  },
  {
    id: "createdAt",
    name: "Дата создания",
    template: (item: any) => formatDate(item.createdAt),
  },
];

const ROWS_PER_PAGE = 10;

export const AdminPage: React.FC = () => {
  const { add } = useToaster();
  const { addToNavigateBar } = useBindNavigator<any>();
  const { params } = useLocationParams<any>(window.location.search);

  const [getPlaces, { data, ...getPlacesRequestInfo }] = useLazyGetPlacesQuery();
  const [updatePlace] = useUpdatePlaceMutation();
  const [createPlace] = useCreatePlaceMutation();
  const [deletePlace] = useDeletePlaceMutation();
  const [createParking] = useCreateParkingMutation();

  const [page, setPage] = React.useState(params.page ? parseInt(params.page) : 1);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    params.rows ? parseInt(params.rows) : ROWS_PER_PAGE
  );

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [openCreatePlaceModal, setOpenCreatePlaceModal] = React.useState(false);
  
  const closeCreatePlaceModal = React.useCallback(() => {
    setOpenCreatePlaceModal(false);
  }, []);

  const handleCreatePlaceClick = () => {
    setOpenCreatePlaceModal(true);
  };

  const handleAddCreatePlaceClick = () => {
    setSelectedId(null);
    handleCreatePlaceClick();
  };

  const getRowActions = (item: any): TableActionConfig<any>[] => {
    return [
      {
        text: "Изменить",
        handler: () => {
          setSelectedId(item.placeId);
          handleCreatePlaceClick();
        },
        icon: <Icon data={Pencil} size={16} />,
      },
      {
        text: "Удалить",
        handler: () => deletePlace(item.placeId),
        theme: "danger" as const,
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

    getPlaces({
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

    getPlaces({
      ...params,
      limit: limit,
      offset: 0,
    });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      await getPlaces({
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
  }, [params.rows, params.page, rowsPerPage, page]);

  const [parkingSpacesCount, setParkingSpacesCount] = React.useState<string>("");
  const [isInitialSetupDone, setIsInitialSetupDone] = React.useState<boolean>(false);

  const handleCreateParkingSpaces = async () => {
    const count = parseInt(parkingSpacesCount);
    if (count > 0) {
      try {
        const response = await createParking({ count }).unwrap();
        
        if (response.errorCode === 0) {
          setIsInitialSetupDone(true);
          add({
            name: "parking-spaces-created",
            title: "Успех",
            content: `Создано ${count} парковочных мест`,
            autoHiding: 3000,
            theme: "success",
          });
          getPlaces({ limit: rowsPerPage, offset: 0 });
        } else {
          throw new Error(response.message || "Ошибка сервера");
        }
      } catch (error) {
        add({
          name: "parking-spaces-error",
          title: "Ошибка",
          content: error instanceof Error ? error.message : "Не удалось создать парковочные места",
          autoHiding: 3000,
          theme: "danger",
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setParkingSpacesCount(value);
    }
  };

  if (!isInitialSetupDone && (!data || data.result.allPlaces.length === 0)) {
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
                size="xl"
                placeholder="Количество парковочных мест"
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

  const totalItems = data?.result.total || 0;
  const places = data?.result.allPlaces || [];
  
  // Сортируем места по placeId в порядке возрастания
  const sortedPlaces = [...places].sort((a, b) => a.placeId - b.placeId);

  return (
    <Layout>
      <div className={b()}>
        <div className={b("table-container")}>
          <div className={b("table-wrapper")}>
            {getPlacesRequestInfo.isFetching ? (
              <Box className={b("loading")}>
                <Spin />
              </Box>
            ) : null}

            <PlacesTable
              data={sortedPlaces}
              columns={columns}
              getRowActions={getRowActions}
              className={b("places-table")}
              width="max"
              emptyMessage="Парковочные места не найдены"
            />

            <Stack
              width="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ pl: 3 }}
              style={{ borderColor: 'white' }}
            >
              <Button
                view="outlined-danger"
                size="xl"
                onClick={handleAddCreatePlaceClick}
              >
                Добавить место
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
                  "& .MuiToolbar-root": { p: 4 },
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

      {openCreatePlaceModal && (
        <CreateOrUpdateFormModal
          open={openCreatePlaceModal}
          placeId={selectedId}
          onClose={closeCreatePlaceModal}
          onCreate={createPlace}
          onUpdate={updatePlace}
        />
      )}
    </Layout>
  );
};