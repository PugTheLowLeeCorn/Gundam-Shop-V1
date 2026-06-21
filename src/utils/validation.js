export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePhone(phone) {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  return /^(\+?84|0)[0-9]{8,10}$/.test(cleaned) || /^[0-9]{9,11}$/.test(cleaned);
}
