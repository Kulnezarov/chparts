/**
 * Клиентская валидация форм
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface CheckoutFormData {
  name: string;
  phoneDigits: string;
  deliveryType: "pickup" | "city" | "post";
  addressLine?: string;
  postCity?: string;
  postDetails?: string;
}

export function validateCheckout(data: CheckoutFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Имя
  if (!data.name?.trim()) {
    errors.push({
      field: "name",
      message: "Укажите имя",
    });
  } else if (data.name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "Имя должно быть не менее 2 символов",
    });
  }

  // Телефон (проверяем что это 11 цифр начиная с 7)
  if (!data.phoneDigits || data.phoneDigits.length !== 11) {
    errors.push({
      field: "phone",
      message: "Введите номер полностью: +7 (XXX) XXX-XX-XX",
    });
  } else if (!data.phoneDigits.startsWith("7")) {
    errors.push({
      field: "phone",
      message: "Номер должен начинаться с +7",
    });
  }

  // Условная валидация доставки
  if (data.deliveryType === "city") {
    if (!data.addressLine?.trim()) {
      errors.push({
        field: "address",
        message: "Укажите адрес доставки",
      });
    }
  } else if (data.deliveryType === "post") {
    if (!data.postCity?.trim()) {
      errors.push({
        field: "city",
        message: "Укажите город",
      });
    }
    if (!data.postDetails?.trim()) {
      errors.push({
        field: "postDetails",
        message: "Укажите отделение или индекс",
      });
    }
  }

  return errors;
}

export function hasFieldError(errors: ValidationError[], fieldName: string): string | undefined {
  return errors.find((e) => e.field === fieldName)?.message;
}
