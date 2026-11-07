import express, { type Express, type Request, type Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ToggleFile, AppToggles } from '../shared/toggles.interface.ts';

const app: Express = express();


app.get('/', (req: Request, res: Response) => {
	const jsonData = readFromFile();
	if(!jsonData)
		res.send("Could not read file").status(500);
	res.send(jsonData);
});

app.post('/add-app', (req:Request, res:Response) => {
	let newApp: AppToggles;
	let currData, updatedData: ToggleFile;
	try{
		newApp = req.body;
	} catch(e){
		res.send("Incorrect app shape").status(404);
		return;
	}
	currData = readFromFile();
	if(!currData){
		res.send("Could not read file").status(500);
		return; //not needed, just for type scoping below
	}
	updatedData = currData;
	updatedData.apps.push(newApp);
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
		console.log(jsonData)
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
