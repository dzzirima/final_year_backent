import { v4 as uuidv4 } from 'uuid';


export const getReferenceNumber =  async () =>{
    let uuid =  await uuidv4();
    return uuid


}