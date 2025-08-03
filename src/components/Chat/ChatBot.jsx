import { useRef, useEffect, useState } from 'react';
import React from 'react';
import styles from './ChatBot.module.css';
import ReactMarkdown from 'react-markdown';


export default function ChatBot({ bot }) {
    const [pergunta, setPergunta] = useState('');
    const [mensagens, setMensagens] = useState([]);
    const endRef = useRef(null);
    const apiUrl = (path) => `${import.meta.env.VITE_API_BASE}/${path}`;



    function scrollToBottom() {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
    }, [mensagens]);

    async function enviarPergunta() {
        if (!pergunta.trim()) return;
        setMensagens((m) => [
            ...m,
            { autor: "usuario", conteudo: pergunta },
            { autor: "bot", conteudo: "...", aguardando: true }
        ]);

        setPergunta('');

        try {
            const res = await fetch(apiUrl(`Gpt/perguntar`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pergunta, botId: bot.id.toString() }),
            });

            if (!res.ok) {
                console.error("Erro da API:", await res.text());
                return;
            }

            const resposta = await res.text();

            setMensagens((m) => {
                const atualizadas = [...m];
                const indexUltima = atualizadas.findIndex(msg => msg.autor === 'bot' && msg.aguardando);
                if (indexUltima !== -1) {
                    atualizadas[indexUltima] = { autor: 'bot', conteudo: resposta };
                }
                return atualizadas;
            });

            await salvarMensagem(bot.id, pergunta, "usuario");
            await salvarMensagem(bot.id, resposta, "bot");

        } catch (err) {
            console.error("Erro ao enviar pergunta:", err);
        }
    }

    {/* salvar mensagem no banco de dados */ }
    async function salvarMensagem(botId, conteudo, autor) {
        const mensagem = {
            botId,
            conteudo,
            autor,
            dataHora: new Date().toISOString()
        };

        await fetch(apiUrl("Mensagem"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mensagem),
        });
    }

    {/* animação de digitando do bot */ }
    function DigitandoAnimado() {
        const [pontos, setPontos] = useState(".");

        useEffect(() => {
            const interval = setInterval(() => {
                setPontos((prev) => (prev.length < 3 ? prev + "." : "."));
            }, 300);

            return () => clearInterval(interval);
        }, []);

        return <span className={styles.botDigitando}>{pontos}</span>;
    }


    {/* carrega histórico do bot */ }
    useEffect(() => {
        if (!bot?.id) return;

        fetch(apiUrl(`Mensagem/${bot.id}`))
            .then(res => res.json())
            .then(data => {
                const mensagensFormatadas = data.map(msg => ({
                    ...msg,
                    autor: msg.autor.trim()
                }));
                setMensagens(mensagensFormatadas);
            });
    }, [bot]);

    return (
        <div className={styles.chatContainer}>
            <h3 className={styles.botTitle}>Conversando com: {bot.nome}</h3>

            <div className={styles.mensagensWrapper}>
                <ul className={styles.mensagemList}>
                    {mensagens.length === 0 ? (
                        <div className={styles.emptyMessage}>
                            <p>Nenhuma conversa ainda. Envie uma mensagem para começar!</p>
                        </div>
                    ) : (
                        mensagens.map((msg, i) => (
                            <li
                                key={i}
                                className={`${styles.mensagemItem} ${msg.autor === "usuario" ? styles.usuario : styles.bot
                                    }`}
                            >
                                <strong>{msg.autor === "usuario" ? "Você" : bot.nome}:</strong>{" "}
                                <div className={styles.mensagemTexto}>
                                    {msg.aguardando ? (
                                        <DigitandoAnimado />
                                    ) : (
                                        <ReactMarkdown>{msg.conteudo}</ReactMarkdown>
                                    )}
                                </div>

                            </li>
                        ))
                    )}
                    <div ref={endRef} />
                </ul>
            </div>

            <div className={styles.inputArea}>
                <input
                    value={pergunta}
                    onChange={(e) => setPergunta(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            enviarPergunta();
                        }
                    }}
                    className={styles.inputPergunta}
                    placeholder={`Comece a conversar com ${bot?.nome || 'o bot'}`}
                />
                <button onClick={enviarPergunta} className={styles.enviarButton}>
                    Enviar
                </button>
            </div>
        </div>
    );
}
