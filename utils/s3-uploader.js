const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION
const AWS_BUCKET = process.env.NEXT_PUBLIC_AWS_BUCKET
const IDENTITY_POOL_ID = process.env.NEXT_PUBLIC_IDENTITY_POOL_ID

export async function uploadMedia(file, directory = ""){
    AWS.config.update({
        region: AWS_REGION,
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IDENTITY_POOL_ID
        })
    })

    const directoryKey = directory ? directory + '/' : "";
    const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const fileExtension = getFileExtension(file.name)
    const fullKey = directoryKey + fileName + fileExtension

    const upload = new AWS.S3.ManagedUpload({
        params: {
            Bucket: AWS_BUCKET,
            Key: fullKey,
            Body: file,
        }
    })

    try {
        const res = await upload.promise();
        return[file.name, res.Location];
    } catch (err){
        return alert(`There was an error uploading your photo: ${err}`)
    }
}

function getFileExtension(str){
    return str.slice(str.lastIndexOf('.'));
}

function generateRandomString(length){
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const characterLength = characters.length
    for (let i = 0; i< length; i++){
        result += characters.charAt(Math.floor(Math.random()*characterLength))
    }
    return result
}

export function generateUniqueFileName(file){
    const fileExtension = getFileExtension(file.name)
    const newFileName = `${file.name.replace(/\.[^/.]+$/, "")} - ${generateRandomString(8)}${fileExtension}`
    return new File([file], newFileName, {
        type: file.type
    })
}