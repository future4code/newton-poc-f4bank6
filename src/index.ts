import * as moment from 'moment';
import { writeFile, readFile } from 'fs'

const nameInput = process.argv[2]
const cpfInput = Number(process.argv[3])
const birthInput = moment(process.argv[4], "DD/MM/YYYY")
const extractInputDate = moment("06/12/2019", "DD/MM/YYYY")
const fileName = "src/accounts.json";

type account = {
    name: string,
    cpf: number,
    birthDate: moment.Moment,
    balance: number,
    extract?: extract[]
}

type extract = {
    category?: string,
    value: number,
    date: moment.Moment,
    description: string
}

const extractTest: extract = {
    value: 50,
    date: extractInputDate,
    description: "teste de extrato"
}

const testAccount: account = {
    name: nameInput,
    cpf: cpfInput,
    birthDate: birthInput,
    balance: 0,
    extract: [extractTest]
}

const getAllAccounts = async () => {
    let accounts: account[];
    await new Promise((resolve, reject) => {
        readFile(fileName, (err, data: Buffer)=> {
            if(err) {
                reject(err);
                return;
            }
            const fileContent = JSON.parse(data.toString()); 
            resolve(fileContent);
        });
    }).then((content: account[])=> {
        accounts = content;
    })
    console.log(accounts);
    return accounts;
}

getAllAccounts();

function createAccount(account: account): void {

    const readFilePromise = new Promise((resolve, reject) => {
        readFile(fileName, (err, data: Buffer)=> {
            if(err) {
                reject(err);
                return;
            }
            const fileContent = JSON.parse(data.toString());
            resolve(fileContent);
        });
    })
    readFilePromise.then((content:account[])=>{
        const writeFilePromise = new Promise((response, reject) => {
            content.push(account);
            const data = JSON.stringify(content);
            writeFile(fileName, data, (err)=>{
                if(err){
                    reject(err);
                    return;
                }
                console.log("Conta criada com sucesso!")
            });
       })
    })
}