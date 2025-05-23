export function getFormattedDate() {
  const today = new Date(); // fecha actual
  const year = today.getFullYear();
  // getMonth() retorna un valor 0-11, por eso se suma 1 para obtener el mes correcto (1-12).
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  // Retornamos en formato YYYY-MM-DD
  return `${year}-${month}-${day}`;
}

export function getFormattedDateV2(date: Date){

  const year = date.getFullYear();
  const month = String(date.getDate()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`

}

export function formatDateYMD(date: Date | string): string {
  // toISOString() es UTC; ajustamos a local con un pequeño truco:
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);            // 'YYYY-MM-DD'
}
