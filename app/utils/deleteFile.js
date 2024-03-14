const fs = require('fs')
const path = require('path')


function deleteImage(imageName) {
  try {
    const folderPath = __dirname + '/../uploads/'
    const pathFile = path.join(folderPath, imageName)
    // Verificar si el archivo existe antes de intentar eliminarlo
    if (fs.existsSync(pathFile)) {
      // Eliminar el archivo
      fs.unlink(pathFile, (error) => {
        if (error) {
          return {
            error: true,
            message: `Error: ${error}`,
            pathImage: imageName
          }
        }
      })      
    } else {
      return {
        error: true,
        message: 'No existe la imagen: ' + imageName,
        pathImage: imageName
      }
    }
  } catch(error) {
    return {
      error: true,
      message: error,
      pathImage: imageName
    }
  }
}

function deleteImagesGroup(imgNames) {
  for(let img of imgNames) {
    let hasError = deleteImage(img.filename)
    if(hasError) { return false }
  }
  return true
}

module.exports = { 
  deleteImage,
  deleteImagesGroup
}