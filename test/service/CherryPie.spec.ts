import { CherryPieService} from "../../src/service/CherryPie";
import { GithubService } from "../../src/service/Github";
import { MessagesService } from "../../src/service/Messages";
import config from "config";

describe("CherryPie Service - Integration Tests", () => {

    let cherry: CherryPieService;
    let github: GithubService;
    let messageService: MessagesService = {
        print: console.log
    }

    beforeAll(async ()=>{
        const { owner, repo, username, password, number, refPrefix } = config.get("github")
        github = new GithubService({owner, repo, number, refPrefix});
        await github.init({username, password});
        cherry = new CherryPieService(github, messageService);
    });

    afterEach(()=>{
        jest.resetAllMocks();
    });

    it("slice()", async () => {
        const paths = ["packages/module-web-launcher/src/ioc.ts"]
        const sourceBranch = "new-web-logger";
        const targetBranch = "new-web-logger-slice";
        const baseBranch = "master";

        const result = await cherry.slice({paths, sourceBranch, targetBranch, baseBranch});
        
        const verifyTarget = await github.getBranch(targetBranch);

        expect(verifyTarget.commit.sha).toEqual(result.object.sha);

        const verifySource = await github.getBranch(sourceBranch);
        const target = await github.getFileContent(paths[0], verifyTarget.commit.sha);
        const source = await github.getFileContent(paths[0], verifySource.commit.sha);
        expect(target).toEqual(source);
       // await github.deleteBranch(targetBranch);
    }, 20000)

})