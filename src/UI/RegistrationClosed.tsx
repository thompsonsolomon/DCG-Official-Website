import { X, LockKeyhole } from 'lucide-react'

type RegistrationClosedModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function RegistrationClosedModal({
  isOpen,
  onClose,
}: RegistrationClosedModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-7 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#008080]/10 flex items-center justify-center mb-5">
          <LockKeyhole
            size={30}
            className="text-[#008080]"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900">
          Registration Closed
        </h2>

        {/* Message */}
        <p className="text-gray-500 mt-3 leading-relaxed">
          Registration for this event is no longer
          available. Thank you for your interest.
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 bg-[#008080] text-white py-3.5 rounded-2xl font-bold hover:bg-[#006b6b] transition"
        >
          Okay
        </button>
      </div>
    </div>
  )
}