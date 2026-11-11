import fs from "fs"
import path from "path"


export function removeFile(folder, fileName) {
    if (!fileName) return
    fs.unlink(path.join(process.cwd(), "src", "uploads", folder, fileName), () => { })
}


export async function saveFile(folder, file, fileName) {
    const dir = path.join(process.cwd(), "src", "uploads", folder)
    fs.mkdirSync(dir, { recursive: true })
    await file.mv(path.join(dir, fileName))
}
