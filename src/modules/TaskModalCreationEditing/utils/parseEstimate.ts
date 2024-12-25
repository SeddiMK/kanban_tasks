// Маска – число + подстановка буквы. Пример, ввод 90 и отображается 90м
// Опционально - ввод 90 и парсится на 1ч 30м
export const parseEstimate = (value: string | number): string => {
   if (!value) return '';

   // Проверяем, является ли значение числом
   if (typeof value === 'number') {
      const minutes = value;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours > 0 ? `${hours}ч ` : ''}${remainingMinutes}м`.trim();
   }

   // Если значение является строкой, проверяем, является ли оно числом
   if (typeof value === 'string' && /^\d+$/.test(value)) {
      const minutes = parseInt(value, 10);
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours > 0 ? `${hours}ч ` : ''}${remainingMinutes}м`.trim();
   }

   return String(value);
};
