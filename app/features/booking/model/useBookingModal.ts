export function useBookingModal() {
  const isOpen = useState('studio313:booking-modal-open', () => false)
  const selectedService = useState('studio313:booking-modal-service', () => '')

  function openBookingModal(service = '') {
    selectedService.value = service.trim().slice(0, 300)
    isOpen.value = true
  }

  function closeBookingModal() {
    isOpen.value = false
    selectedService.value = ''
  }

  return {
    isOpen,
    selectedService,
    openBookingModal,
    closeBookingModal,
  }
}
