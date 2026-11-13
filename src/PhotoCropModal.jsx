
import { useCallback, useState } from 'react'
import Cropper from 'react-easy-crop'

function createCroppedImage(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      const outputSize = 512

      canvas.width = outputSize
      canvas.height = outputSize

      context.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputSize,
        outputSize
      )

      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }

    image.onerror = reject
    image.src = imageSrc
  })
}

function PhotoCropModal({ image, onCancel, onSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [saving, setSaving] = useState(false)

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  async function handleSave() {
    if (!croppedAreaPixels) return

    try {
      setSaving(true)

      const croppedImage = await createCroppedImage(
        image,
        croppedAreaPixels
      )

      onSave(croppedImage)
    } catch (error) {
      console.error('Photo crop failed:', error)
      alert('Gagal memproses foto. Silakan coba gambar lain.')
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-title"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 id="crop-title" className="text-lg font-black">
              Adjust Your Photo
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Drag to reposition and zoom to adjust.
            </p>
          </div>

          <button
            onClick={onCancel}
            disabled={saving}
            aria-label="Close photo editor"
            className="rounded-full px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative h-80 w-full bg-slate-950 sm:h-96">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            restrictPosition={true}
          />
        </div>

        {/* Zoom Control */}
        <div className="p-5">

          <div className="mb-3 flex items-center justify-between">
            <label
              htmlFor="photo-zoom"
              className="text-sm font-bold text-slate-700"
            >
              Zoom Photo
            </label>

            <span className="text-sm font-semibold text-blue-600">
              {zoom.toFixed(1)}x
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg text-slate-400">−</span>

            <input
              id="photo-zoom"
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={event => setZoom(Number(event.target.value))}
              className="h-2 flex-1 cursor-pointer accent-blue-600"
            />

            <span className="text-lg text-slate-400">+</span>
          </div>

          <p className="mt-3 text-center text-xs text-slate-400">
            Drag the image to position it inside the circle.
          </p>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onCancel}
              disabled={saving}
              className="flex-1 rounded-xl border border-slate-200 py-3 font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving || !croppedAreaPixels}
              className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Photo'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PhotoCropModal
