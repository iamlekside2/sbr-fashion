/**
 * Stamps the SBR gold crest watermark onto an image before upload.
 * Uses Canvas API to overlay /logo-gold.png at bottom-right with opacity 0.7.
 *
 * @param {File} file - The image file to watermark
 * @returns {Promise<Blob>} - Watermarked image as a Blob
 */
export async function addWatermark(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const logo = new Image()
    let imgLoaded = false
    let logoLoaded = false

    const tryRender = () => {
      if (!imgLoaded || !logoLoaded) return

      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')

      // Draw the original image
      ctx.drawImage(img, 0, 0)

      // Calculate logo size (10% of image width, max 120px)
      const logoSize = Math.min(img.width * 0.1, 120)
      const logoHeight = (logo.height / logo.width) * logoSize
      const padding = Math.max(img.width * 0.02, 12)

      // Draw watermark at bottom-right with opacity
      ctx.globalAlpha = 0.7
      ctx.drawImage(
        logo,
        img.width - logoSize - padding,
        img.height - logoHeight - padding,
        logoSize,
        logoHeight
      )
      ctx.globalAlpha = 1.0

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to create watermarked image'))
        },
        file.type || 'image/jpeg',
        0.92
      )
    }

    img.onload = () => { imgLoaded = true; tryRender() }
    img.onerror = () => reject(new Error('Failed to load image'))

    logo.onload = () => { logoLoaded = true; tryRender() }
    logo.onerror = () => {
      // If logo fails to load, return original file as-is
      console.warn('Watermark logo not found, uploading without watermark')
      file.arrayBuffer().then(buf => resolve(new Blob([buf], { type: file.type })))
    }

    img.src = URL.createObjectURL(file)
    logo.crossOrigin = 'anonymous'
    logo.src = '/logo-gold.png'
  })
}
