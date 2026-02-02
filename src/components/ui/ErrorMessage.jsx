export const ErrorMessage = ({ message, error }) => {
    console.error('ErrorMessage component error:', error)
  return (
    <div className="flex justify-center items-center py-8">
                <div className="text-red-500">{message}</div>
              </div>
  )
}