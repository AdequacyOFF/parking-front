import React from "react";
import { Modal, Button, TextInput } from "@gravity-ui/uikit";
import { useToaster } from "@gravity-ui/uikit";


interface CreateOrUpdateFormModalProps {
    open: boolean;
    placeId: string | null; // Изменено с number | null на string | null
    onClose: () => void;
    onCreate: (params: any) => void;
    onUpdate: (params: any) => void;
  }

export const CreateOrUpdateFormModal: React.FC<CreateOrUpdateFormModalProps> = ({
  open,
  placeId,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const { add } = useToaster();
  const [formData, setFormData] = React.useState({
    ownerId: "",
    firstName: "",
    lastName: "",
    patronymic: "",
  });

  React.useEffect(() => {
    if (!open) {
      setFormData({
        ownerId: "",
        firstName: "",
        lastName: "",
        patronymic: "",
      });
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.ownerId || !formData.firstName || !formData.lastName) {
      add({
        name: "form-error",
        title: "Ошибка",
        content: "Заполните обязательные поля",
        autoHiding: 3000,
        theme: "danger",
      });
      return;
    }

    if (placeId) {
      onUpdate({ placeId, ...formData });
    } else {
      onCreate(formData);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} >
      <div style={{ padding: 20 }}>
        <h2>{placeId ? "Редактировать место" : "Добавить новое место"}</h2>
        
        <div style={{ marginBottom: 16 }}>
          <TextInput
            label="ID владельца"
            name="ownerId"
            value={formData.ownerId}
            onChange={handleInputChange}
            size="l"
            placeholder="Введите ID владельца"

          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <TextInput
            label="Имя"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            size="l"
            placeholder="Введите имя"

          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <TextInput
            label="Фамилия"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            size="l"
            placeholder="Введите фамилию"
          />
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <TextInput
            label="Отчество"
            name="patronymic"
            value={formData.patronymic}
            onChange={handleInputChange}
            size="l"
            placeholder="Введите отчество (необязательно)"
          />
        </div>
        
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button view="outlined" onClick={onClose}>
            Отмена
          </Button>
          <Button view="action" onClick={handleSubmit}>
            {placeId ? "Сохранить" : "Добавить"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};