export const getFileContent = (file: File): Promise<string> => {
  const reader = new FileReader()
  return new Promise<string>((resolve) => {
    reader.onload = (e: ProgressEvent<FileReader>) => {
      resolve(e.target.result as string)
    }
    reader.readAsDataURL(file)
  })
}
