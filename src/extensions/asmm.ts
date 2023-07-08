import * as nodecgApiContext from './nodecg-api-context';
import sql from 'mssql';

const nodecg = nodecgApiContext.get();
const log = new nodecg.Logger("ASMM");

const asmmTotalKMRep = nodecg.Replicant<number>('asmm:totalKM');

const URL = nodecg.bundleConfig.asmm?.url;
const PASSWORD = nodecg.bundleConfig.asmm?.password;

function connect(sqlLib: typeof sql) {
	return sqlLib.connect(`Server=tcp:${URL},1433;Initial Catalog=ASMM_DATA;Persist Security Info=False;User ID=asmmsqlaccess;Password=${PASSWORD};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`)
}

type TotalKM = {
	KmCount: number;
}

async function getTotalKM() {
	try {
		await connect(sql);
		const data = await sql.query<TotalKM>`
		SELECT CONVERT(DECIMAL(10,2),SUM([Steps]) * 0.71628 / 1000) As KmCount
		FROM [dbo].[StepData]
		WHERE EventId = 1`;
		asmmTotalKMRep.value = data.recordset[0].KmCount;
	} catch (error) {
		return log.error(error);
	}
}

setInterval(getTotalKM, 5000);
