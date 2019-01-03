import { inject, injectable } from "inversify";

@injectable()
export class MessagesService {

    print(text) {
        console.log(text);
    }
}