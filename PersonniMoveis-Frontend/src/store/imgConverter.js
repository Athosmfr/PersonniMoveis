/** Faz o gerenciamento e conversão de arquivos para base64. */
export default {
    async fileToBase64String(file) {
        try {
            const base64String = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
            return base64String;
        } catch(error) {
            console.error('Não foi possível fazer o upload da imagem: ', error);
        }
    },

	/** Define se deve atribuir imagem default ao produto (caso nenhuma imagem seja fornecida). */
    async shouldSetDefaultImage() {
        //a fazer...
    },
}