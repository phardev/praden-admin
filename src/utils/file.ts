const readFile = (file: File, mode: 'text' | 'dataUrl'): Promise<string> => {
  const reader = new FileReader()
  return new Promise<string>((resolve, reject) => {
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        resolve(result)
      } else {
        reject(new Error('Failed to read file as string'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }

    if (mode === 'text') reader.readAsText(file)
    else reader.readAsDataURL(file)
  })
}

export const readFileAsText = (file: File) => readFile(file, 'text')

export const getFileContent = (file: File) => readFile(file, 'dataUrl')
