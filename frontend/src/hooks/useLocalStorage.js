export default function useLocalStorage(key) {
    const setItem = (value) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error);
        }
    }
    const getItem = () => {
        try {
            const data = JSON.parse(window.localStorage.getItem(key));
            return data;
        } catch (error) {
            console.log(error);
        }
    }
    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.log(error);
        }
    }
    return { setItem, getItem, removeItem };
}
