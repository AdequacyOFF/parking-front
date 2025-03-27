import React from 'react';
import block from 'bem-cn-lite';
import {Button, Icon, Label, TextInput, useToaster} from '@gravity-ui/uikit';
import {DatePicker} from '@gravity-ui/date-components';

import './CreatePromotionModal.scss';
import {CircleXmarkFill, Xmark} from '@gravity-ui/icons';
import {FormModal} from '../../../../components/modal';
import {InputLabel} from '../../../../components/input-label';
import {PrimaryButton} from '../../../../components/button';
import { CreatePromotionPostParams, UpdatePromotionPostParams } from '../../../../store/api/admin/types/request';
import { useLazyGetPromotionByIdQuery } from '../../../../store/api/admin';
import { DateTime } from '@gravity-ui/date-utils';
import { dateTime} from '@gravity-ui/date-utils';
import { uploadedDate } from '../../../../utils/date';

const b = block('create-promotion-modal');




interface CreateOrUpdateFormModalProps {
  open: boolean;
  promotionId: string | null;
  onClose: () => void;
  onCreate: (params: CreatePromotionPostParams) => void;
  onUpdate: (params: UpdatePromotionPostParams) => void;
}

export const CreateOrUpdateFormModal: React.FC<CreateOrUpdateFormModalProps> = ({
  open,
  promotionId,
  onClose, 
  onCreate,
  onUpdate
}) => {
  const {add} = useToaster();

  const [title, setTitle] = React.useState('');
  const [file, setFile] = React.useState<any>(null);
  const [shortDescription, setShortDescription] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [url, setUrl] = React.useState("");
  const [startDate, setStartDate] = React.useState<DateTime | null>(null);
  const [endDate, setEndDate] = React.useState<DateTime | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = React.useState<any>(null); // Для хранения URL текущего фото

  

  const [getPromotionById, {
    data: getPromotionByIdResponse,
    ...getPromotionByIdRequestInfo
  }] = useLazyGetPromotionByIdQuery();


  const clearInput = () => {
    setTitle("");
    setFile("");
    setShortDescription("");
    setDescription("");
    setUrl("");
    setStartDate(null);
    setEndDate(null);
    setCurrentPhotoUrl(null); // Очищаем URL текущего фото
  }


  const handleOnCloseBtnClick = () => {
    clearInput();
    onClose();
  }

  const handleOnAddPromotionClick = () => {
    if (!endDate || 
      !startDate || 
      !file || 
      !title || 
      !shortDescription || 
      !description) {
        add({
          name: 'update-fuel-volume-success',
          title: 'Не удалось создать акцию',
          content: 'Необходимо заполнить все обязательные поля',
          autoHiding: 3000,
        });
      return;
    }

    onCreate({
      title,
      description,
      shortDescription,
      endDate: uploadedDate(endDate.toISOString()),
      startDate: uploadedDate(startDate.toISOString()),
      file,
      url
    });
    clearInput();
    handleOnCloseBtnClick();
  }

  const handleOnUpdatePromotionClick = () => {
    if (promotionId) {
      if (!endDate || 
        !startDate || 
        !title || 
        !shortDescription || 
        !description) {
          add({
            name: 'update-fuel-volume-success',
            title: 'Не удалось изменить акцию',
            content: 'Необходимо заполнить все обязательные поля',
            autoHiding: 3000,
          });
        return;
      }

      onUpdate({
        id: promotionId,
        title,
        description,
        shortDescription,
        endDate: uploadedDate(endDate.toISOString()),
        startDate: uploadedDate(startDate.toISOString()),
        file, 
        url
      });
      clearInput();
    }
  }


  React.useEffect(() => {
    if (open) {
      clearInput();
      if (promotionId) {
        getPromotionById(promotionId);
      }
    }
  }, [open, promotionId, getPromotionById])
  
  

  React.useEffect(() => {
    if (getPromotionByIdRequestInfo.isSuccess && getPromotionByIdResponse?.result) {
      const promotion = getPromotionByIdResponse.result;
      const oldEndTime = dateTime({
        input: promotion.endDate,
        format: "YYYY-MM-DD",
    });
    const oldStartTime = dateTime({
      input: promotion.startDate,
      format: "YYYY-MM-DD",
  });
      setTitle(promotion.title);
      setUrl(promotion.url);
      setDescription(promotion.description);
      setCurrentPhotoUrl(promotion.photo);
      setShortDescription(promotion.shortDescription);
      setStartDate(oldStartTime);
      setEndDate(oldEndTime);
    }
  }, [getPromotionByIdRequestInfo.isSuccess, getPromotionByIdResponse, setTitle, setUrl, setDescription]);

  React.useEffect(() => {
    if ( 
      (getPromotionByIdRequestInfo.isError && getPromotionByIdRequestInfo.error)
    ) {

      // @ts-ignore
      const errorMessage = getPromotionByIdRequestInfo?.error?.error.message || startWithdrawRequestInfo?.error?.error.message || "";

      add({
        name: 'error',
        autoHiding: 3000,
        isClosable: true,
        title: `Невозможно выполнить запрос`,
        renderIcon: () => <Icon className="success-red" data={CircleXmarkFill} size={18} />,
        content: errorMessage,
      });
    }
  }, [
    getPromotionByIdRequestInfo.isError, getPromotionByIdRequestInfo.error, add,
  ]);

  return (
    <FormModal
      width={400}
      open={open}
      onClose={handleOnCloseBtnClick}
      title={promotionId ? "Изменить акцию" : "Добавить акцию"}
      actions={
        <div className="action-btns">
          <Button
            view="flat"
            onClick={handleOnCloseBtnClick}
            style={{
              color: '#00000080',
            }}
          >
            Отмена
            <Icon data={Xmark} size={16} />
          </Button>
          {promotionId
            ? <PrimaryButton
                onClick={handleOnUpdatePromotionClick}
              >
                Изменить
              </PrimaryButton>
            : <PrimaryButton
                onClick={handleOnAddPromotionClick}
              >
                Добавить
              </PrimaryButton>
          }
        </div>
      }
    >
      <div className={b()}>
        <InputLabel labelText="Название">
          <TextInput
            size="l"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          />
        </InputLabel>
        <InputLabel labelText="Краткое описание">
          <TextInput
            size="l"
            value={shortDescription}
            onChange={(e: any) => setShortDescription(e.target.value)}
          />
        </InputLabel>
        <InputLabel labelText="Полное описание">
          <TextInput
            size="l"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
          />
        </InputLabel>
        <InputLabel labelText="Дата начала">
          <DatePicker
            size="l"
            value={startDate}
            onUpdate={(newDate: DateTime | null) => setStartDate(newDate)}
            hasClear
            style={{ width: '100%' }}
          />
        </InputLabel>
        <InputLabel labelText="Дата окончания">
          <DatePicker
            size="l"
            value={endDate}
            onUpdate={(newDate: DateTime | null) => setEndDate(newDate)}
            hasClear
            style={{ width: '100%' }}
          />
        </InputLabel>
        <InputLabel labelText="URL">
          <TextInput
            size="l"
            value={url}
            onChange={(e: any) => setUrl(e.target.value)}
          />
        </InputLabel>
        <InputLabel labelText="Фото">
          {currentPhotoUrl && ( // Если есть текущее фото, отображаем его
            <div style={{ marginBottom: '10px' }}>
              <img
                src={currentPhotoUrl}
                alt="Current Promotion"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
              />
            </div>
          )}
          <label htmlFor="file">
            <Label theme="unknown">
              {file ? 'Изменить фото' : 'Загрузить фото'}
            </Label>
          </label>
          {file && <div>{file.name}</div>}
          <input
            id="file"
            type="file"
            hidden
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
                setCurrentPhotoUrl(URL.createObjectURL(e.target.files[0])); // Показываем превью нового файла
              }
            }}
            
          />
        </InputLabel>
      </div>
    </FormModal>
  );
};
