
import {  testConnection } from "../controllers/blockchain.js";

export const test = async() =>{
    /**By default it will connect (i.e. ``http:/\/localhost:8545``) */

    try {

        if(testConnection()){
            console.log("Call other  blockchain related functions")
        }
        
    } catch (error) {
    
    }
}
test()
