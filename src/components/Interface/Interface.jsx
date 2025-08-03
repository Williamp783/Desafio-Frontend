import { useState, useEffect } from 'react';
import BotForm from "../Form/BotForm";
import BotList from "../Lista/BotList";
import ChatBot from "../Chat/ChatBot";
import styles from './Interface.module.css';

import adicionarIcon from '../../assets/adicionar.png';
import barraLateralIcon from '../../assets/barra-lateral.png';
import refreshIcon from '../../assets/refresh-arrow.png';




export default function Interface() {
    const [selectedBot, setSelectedBot] = useState(null);
    const [bots, setBots] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [sidebarCompact, setSidebarCompact] = useState(false);
    const [loading, setLoading] = useState(false);


    const apiUrl = (path) => `${import.meta.env.VITE_API_BASE}/${path}`;

    async function fetchBots() {
        setLoading(true);
        try {
            const res = await fetch(apiUrl("Bot"));
            if (!res.ok) {
                console.error("Erro ao buscar bots:", await res.text());
                return;
            }
            const data = await res.json();
            setBots(data);
        } catch (err) {
            console.error("Erro inesperado:", err);
        } finally {
            setLoading(false);
        }
    }



    function toggleSidebarSize() {
        setSidebarCompact(prev => !prev);
    }


    useEffect(() => {
        fetchBots();
    }, []);


    function handleBotCreated() {
        fetchBots();
        setSelectedBot(null);
        setFormOpen(false);
    }

    function toggleForm() {
        setFormOpen(!formOpen);
    }

    return (
        <div className={styles.interfaceContainer}>
            <div className={`${styles.sidebar} ${sidebarCompact ? styles.compact : ''}`}>
                <button
                    className={styles.toggleButton}
                    onClick={toggleSidebarSize}
                    title="Alternar modo da barra lateral"
                >
                    <img
                        src={barraLateralIcon}
                        alt="Alternar barra"
                        className={`${styles.iconFlip} ${sidebarCompact ? styles.flipped : ''}`}
                        width={24} height={24}
                    />
                </button>
                {!sidebarCompact && (
                    <>
                        <h2 className={styles.title}>Bots</h2>

                        <div className={styles.buttonRow}>
                            <button
                                className={styles.addButton}
                                onClick={fetchBots}
                                title="Atualizar lista de bots"
                                disabled={loading}
                            >
                                <img src={refreshIcon} alt="Atualizar Bots" width={24} height={24} />
                                {loading && <span className={styles.spinner}></span>}
                            </button>

                            <button
                                className={styles.addButton}
                                onClick={toggleForm}
                                title="Adicionar novo bot"
                            >
                                <img src={adicionarIcon} alt="Adicionar bot" width={24} height={24} />
                                <span>Criar novo Bot</span>
                            </button>
                        </div>
                    </>
                )}
                <BotList bots={bots} onSelect={setSelectedBot} />

                {formOpen && (
                    <div className={styles.overlay}>
                        <div className={styles.popup}>
                            <BotForm onBotCreated={handleBotCreated} />
                            <button
                                className={styles.closeButton}
                                onClick={toggleForm}
                                title="Fechar"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                )}

            </div>

            <div className={styles.chatArea}>
                {selectedBot ? (
                    <ChatBot bot={selectedBot} />
                ) : (
                    <div className={styles.BvMensagem}>
                        <h3>Selecione ou crie seu bot para começar a conversar!</h3>
                        <button
                                className={styles.addButton2}
                                onClick={toggleForm}
                                title="Adicionar novo bot"
                            >
                                <img src={adicionarIcon} alt="Adicionar bot" width={24} height={24} />
                                <span>Criar novo Bot</span>
                            </button>
                    </div>
                )}
            </div>
        </div>
    );
}
