export class StorageService {
	static loadFromStorage = async () => {
		const saved = await localStorage.getItem("repos");
		if (saved) {
			return JSON.parse(saved);
		}
		return {};
	};
	static saveToStorage = async repos => {
		await localStorage.setItem("repos", JSON.stringify(repos));
	};

	static addRepo = async ({
		url,
		login,
		password
	}: {
		url: string;
		login: string;
		password: string;
	}) => {
		const load = await StorageService.loadFromStorage();
		load[url] = { url, login, password };
		StorageService.saveToStorage(load);
	};
}
