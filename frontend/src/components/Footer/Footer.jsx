import React from 'react';
import { Github, Mail, Heart, Coffee } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Serenity Hub</h3>
            <p>Your daily companion for mindfulness and productivity.</p>
            <div className={styles.social}>
              <a 
                href="https://github.com/silvanicholas/serenity-hub" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.iconLink}
              >
                <Github size={20} />
              </a>
              <a 
                href="mailto:swd7104@gmail.com" 
                className={styles.iconLink}
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className={styles.section}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/meditation">Meditation</a></li>
              <li><a href="/pomodoro">Focus Timer</a></li>
              <li><a href="/progress">Progress</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            Made with <Heart size={16} className={styles.heartIcon} />
               by{' The Peacekeepers'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;