import { useState } from 'react';
import styles from './BotForm.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BotForm({ onBotCreated }) {
    const [nome, setNome] = useState('');
    const [personalidade, setPersonalidade] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = (path) => `${import.meta.env.VITE_API_BASE}/${path}`;

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(apiUrl("Bot"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, personalidade }),
            });

            if (res.ok) {
                setNome('');
                setPersonalidade('');
                onBotCreated();

                toast.success("Bot criado com sucesso!");
            } else {
                console.error('Erro ao criar bot');
                toast.error("Erro ao criar bot. Tente novamente mais tarde.");
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            toast.error("Erro de conexão com o servidor.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <label className={styles.label}>
                    Nome do Bot:
                    <input
                        className={styles.inputField}
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        placeholder="Insira um nome para o bot"
                        required
                    />
                </label>

                <label className={styles.label}>
                    Personalidade:
                    <input
                        className={styles.inputField}
                        value={personalidade}
                        onChange={e => setPersonalidade(e.target.value)}
                        placeholder="Ex: Você é um assistente de vendas educado"
                        required
                    />
                </label>

                <button
                    type="submit"
                    className={styles.formButton}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className={styles.spinner}></span>
                    ) : (
                        'Criar Bot'
                    )}
                </button>
            </form>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </>
    );
}
