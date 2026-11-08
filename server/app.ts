import express, { type Express, type Request, type Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ToggleFile, AppToggle, AppToggleSchema } from '../shared/toggles.interface.ts';
import bodyParser from 'body-parser';
import * as z from 'zod';

const app: Express = express();
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
	const jsonData = readFromFile();
	if(!jsonData)
		res.send("Could not read file").status(500);
	res.send(jsonData);
});

app.post('/add-app', (req:Request, res:Response) => {
	let newApp: AppToggle;
	let currData, updatedData: ToggleFile;
	try{
		newApp = z.parse(AppToggleSchema, req.body);
	} catch(e){
		console.log(e);
		res.send("Incorrect app shape").status(404);
		return;
	}
	currData = readFromFile();
	if(!currData){
		res.send("Could not read file").status(500);
		return; //not needed, just for type scoping below
	}
	const existingApps = currData.apps ? currData.apps : [];

	updatedData = {
		...currData,
		apps: [ newApp, ...existingApps ]
	};
	console.log(newApp);
	
	if(writeToFile(updatedData)){
		res.send("App successfully added").status(201);
	}else{
		res.send("Unable to add app to file").status(500);
	}
});

function readFromFile():ToggleFile|null {
	const filePath = path.join(__dirname, 'features.json');
	try{
		const data = fs.readFileSync(filePath, 'utf8');
		const jsonData:ToggleFile = JSON.parse(data);
		console.log("Retrieved Data from File:");
		return jsonData;
	} catch(e) {
		console.log("Error getting data from file: \n" + e);
		return null;
	}
}

function writeToFile(data: ToggleFile):boolean {
	const filePath = path.join(__dirname, 'features.json');
	try{
		const dataStr:string = JSON.stringify(data);
		fs.writeFileSync(filePath, dataStr);
		return true;
	} catch(e) {
		console.log("Error writing data to file: \n" + e);
		return false;
	}
}
app.listen(3000);
