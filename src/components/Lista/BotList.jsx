import styles from './BotList.module.css';



export default function BotList({ bots, onSelect }) {
  
  return (
    <ul className={styles.botList}>
      {bots.map(bot => (
        <li
          key={bot.id}
          className={styles.botItem}
          onClick={() => onSelect(bot)}
        >
          {bot.nome}
        </li>
      ))}
    </ul>
  );
}
