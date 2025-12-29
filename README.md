# MageBonk - Game Design Document

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Conceito do Jogo](#2-conceito-do-jogo)
3. [Mecânicas de Jogo](#3-mecânicas-de-jogo)
4. [Sistema de Feitiços](#4-sistema-de-feitiços)
5. [Sistema de Inimigos](#5-sistema-de-inimigos)
6. [Controles](#6-controles)
7. [Interface do Usuário](#7-interface-do-usuário)
8. [Arte e Estilo Visual](#8-arte-e-estilo-visual)
9. [Áudio](#9-áudio)
10. [Especificações Técnicas](#10-especificações-técnicas)
11. [Roadmap de Desenvolvimento](#11-roadmap-de-desenvolvimento)

---

## 1. Visão Geral

### 1.1 Título
**MageBonk**

### 1.2 Gênero
Arena Shooter / Action / Survival com controle por voz

### 1.3 Plataforma
Web Browser (Desktop)

### 1.4 Público-Alvo
- **Idade:** 12+ anos
- **Requisitos:** Capacidade de fala em português brasileiro e controle de teclado/mouse
- **Perfil:** Jogadores que buscam experiências inovadoras com interação por voz

### 1.5 Resumo do Conceito
MageBonk é um jogo de ação em primeira pessoa onde o jogador controla um mago que lança feitiços através de comandos de voz. O objetivo é sobreviver a ondas de inimigos enquanto maximiza sua pontuação. Inspirado em **Mage Arena** (combate mágico em arena) e **Megabonk** (ação rápida com ataques ágeis).

### 1.6 Unique Selling Points (USPs)
- **Conjuração por Voz:** Lance feitiços falando os nomes das magias
- **Combate Dinâmico:** Inimigos com IA que perseguem e atacam o jogador
- **Visual Imersivo:** Grama procedural com 500.000 lâminas animadas por shaders customizados
- **Acessibilidade:** Configurações completas de áudio, gameplay e gráficos

---

## 2. Conceito do Jogo

### 2.1 Referências

#### Megabonk
Jogo de ação e plataforma com ataques rápidos (bonks) para derrotar inimigos. Foco em:
- Movimentos ágeis
- Combate simples e acelerado
- Progressão por fases curtas

#### Mage Arena
Arena-brawler mágico com ondas de inimigos e feitiços elementares. Características:
- Feitiços com alcance, dano e efeitos distintos
- Gerenciamento de recursos (mana/cooldown)
- Sobrevivência e aprimoramento entre rodadas

### 2.2 Pilares de Design

| Pilar | Descrição |
|-------|-----------|
| **Imersão Vocal** | Falar o nome do feitiço cria conexão direta com a ação |
| **Ação Rápida** | Combate fluido com feedback visual instantâneo |
| **Sobrevivência** | Tensão crescente com ondas de inimigos cada vez mais difíceis |
| **Simplicidade** | Curva de aprendizado suave, domínio progressivo |

### 2.3 Fluxo de Jogo

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Menu       │────▶│  Gameplay   │────▶│  Game Over  │
│  Principal  │     │  (Arena)    │     │  (Score)    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Configurações│    │   Pause     │     │  Reiniciar  │
└─────────────┘     │   Menu      │     │  ou Sair    │
                    └─────────────┘     └─────────────┘
```

---

## 3. Mecânicas de Jogo

### 3.1 Movimentação do Jogador

| Parâmetro | Valor | Descrição |
|-----------|-------|-----------|
| Velocidade | 0.15 u/frame | Velocidade de deslocamento |
| Força do Pulo | 0.4 u/frame | Impulso vertical inicial |
| Gravidade | 0.012 u/frame | Aceleração de queda |
| Altura do Jogador | 3.0 unidades | Nível dos olhos da câmera |
| Raio de Colisão | 1.5 unidades | Detecção de colisão com barreiras |

### 3.2 Sistema de Vida

- **Vida Máxima:** 100 HP
- **Barra de Vida:** Exibida no HUD em tempo real
- **Morte:** Quando HP ≤ 0, fim de jogo

### 3.3 Sistema de Pausa

O jogo pausa automaticamente quando:
- Jogador pressiona **P** ou **ESC**
- Janela perde foco (troca de aba)
- Mouse sai do bloqueio (pointer lock)

---

## 4. Sistema de Feitiços

### 4.1 Conjuração por Voz

O jogador lança feitiços falando seus nomes em português. O sistema utiliza a Web Speech API para reconhecimento de voz.

**Fluxo de Conjuração:**
1. Jogador pressiona **V** para ativar escuta
2. Fala o nome do feitiço (ex: "Fireball")
3. Sistema reconhece a palavra
4. Feitiço é disparado com feedback visual
5. Cooldown é aplicado

### 4.2 Lista de Feitiços

#### Fireball (Bola de Fogo)
| Atributo | Valor |
|----------|-------|
| Tipo | Projétil |
| Dano | Alto |
| Alcance | Médio-Longo |
| Efeito | Explosão ao impacto |
| Cooldown | Médio |

**Comportamento:**
- Projétil visual de bola de fogo
- Movimento em linha reta até colidir
- Explosão ao atingir inimigo ou obstáculo
- Aplica dano e knockback

#### Push Wave (Onda de Empurrão)
| Atributo | Valor |
|----------|-------|
| Tipo | Área (AoE) |
| Dano | Baixo |
| Alcance | Curto (ao redor do jogador) |
| Efeito | Empurrão radial |
| Cooldown | Curto |

**Comportamento:**
- Área circular centrada no jogador
- Empurra inimigos proporcionalmente à distância
- Feedback visual de onda expansiva
- Útil para criar espaço

#### Water Jet (Jato de Água)
| Atributo | Valor |
|----------|-------|
| Tipo | Feixe contínuo |
| Dano | Baixo (por segundo) |
| Alcance | Médio |
| Efeito | Empurrão constante |
| Cooldown | Longo (após uso) |

**Comportamento:**
- Fluxo contínuo enquanto ativo
- Empurrão leve constante
- Consome recurso/tempo de uso
- Bom para controle de crowd

### 4.3 Sistema Base de Feitiços

Estrutura comum para todos os feitiços:
- **Cooldown:** Tempo de recarga após uso
- **Duração:** Tempo de efeito (para feitiços contínuos)
- **Atualização por Frame:** Integração com game loop
- **Extensibilidade:** Fácil adição de novos spells

---

## 5. Sistema de Inimigos

### 5.1 Estrutura Base

Todos os inimigos compartilham:
- **Ciclo de Vida:** Spawn → Idle → Perseguir → Atacar → Morrer
- **Parâmetros:** Vida, velocidade, força de impacto, tamanho
- **Interface de Dano:** Receber dano e knockback
- **Registro Global:** Lista de inimigos ativos no mundo

### 5.2 Estados de IA

```
┌─────────┐    Player próximo    ┌──────────────┐
│  Idle   │─────────────────────▶│ Perseguindo  │
└─────────┘                      └──────────────┘
     ▲                                  │
     │                                  ▼
     │         Player longe      ┌──────────────┐
     └───────────────────────────│   Atacando   │
                                 └──────────────┘
                                        │
              Recebe dano               ▼
         ┌──────────────┐        ┌──────────────┐
         │  Atordoado   │◀───────│   (Combate)  │
         └──────────────┘        └──────────────┘
                │
                ▼ HP ≤ 0
         ┌──────────────┐
         │    Morto     │
         └──────────────┘
```

### 5.3 Detecção do Player

- **Detecção por Distância:** Raio de percepção configurável
- **Campo de Visão:** (Opcional) Cone de visão frontal
- **Eventos:** `playerEncontrado`, `playerPerdido`
- **Otimização:** Atualizações escalonadas (não todo frame)

### 5.4 Sistema de Dano e Knockback

```javascript
// Exemplo de interface
inimigo.levarDano(valor)           // Reduz HP
inimigo.sofrerKnockback(força, direção)  // Aplica impulso
```

**Feedback Visual:**
- Piscar ao receber dano
- Animação de empurrão
- Efeito de morte

---

## 6. Controles

### 6.1 Teclado

| Tecla | Ação |
|-------|------|
| W / ↑ | Mover para frente |
| S / ↓ | Mover para trás |
| A / ← | Mover para esquerda |
| D / → | Mover para direita |
| Espaço | Pular |
| V | Ativar/Desativar reconhecimento de voz |
| P | Pausar/Despausar jogo |
| ESC | Liberar mouse / Pausar |

### 6.2 Mouse

| Ação | Função |
|------|--------|
| Movimento | Rotação da câmera (Yaw/Pitch) |
| Sensibilidade | Configurável (1-10, padrão: 5) |
| Inversão Y | Opcional nas configurações |

### 6.3 Voz

| Comando | Efeito |
|---------|--------|
| "Fireball" | Lança bola de fogo |
| "Push" | Ativa onda de empurrão |
| "Water" | Ativa jato de água |

---

## 7. Interface do Usuário

### 7.1 HUD (Heads-Up Display)

```
┌────────────────────────────────────────────────────────┐
│ [HP: ████████░░]                        [FPS: 60]      │
│                                                        │
│                                                        │
│                         +                              │
│                     (Crosshair)                        │
│                                                        │
│                                                        │
│ [🎤 Ouvindo...]                     [Controles: WASD]  │
└────────────────────────────────────────────────────────┘
```

**Elementos:**
- Barra de vida (canto superior esquerdo)
- Contador de FPS (canto superior direito, apenas dev)
- Crosshair central
- Indicador de voz (quando ativo)
- Painel de informações de controles

### 7.2 Menu Principal

- **Novo Jogo:** Inicia partida
- **Configurações:** Abre menu de opções
- **Efeito de Partículas:** Background animado

### 7.3 Menu de Pausa

Acessível durante gameplay com overlay semi-transparente.

### 7.4 Configurações

#### Áudio
| Opção | Descrição |
|-------|-----------|
| Volume Geral | 0-100% |
| Volume Música | 0-100% |
| Volume Efeitos | 0-100% |

#### Gameplay
| Opção | Descrição |
|-------|-----------|
| Sensibilidade do Mouse | 1-10 |
| Inverter Eixo Y | Sim/Não |
| Dificuldade | Fácil/Normal/Difícil |

#### Gráficos
| Opção | Descrição |
|-------|-----------|
| Qualidade | Baixo/Médio/Alto/Ultra |
| Sombras | Ligado/Desligado |
| Bloom | Ligado/Desligado |

---

## 8. Arte e Estilo Visual

### 8.1 Direção de Arte
Estilo low-poly estilizado com elementos mágicos e cores vibrantes.

### 8.2 Ambiente

| Elemento | Descrição |
|----------|-----------|
| Céu | Esfera azul com gradiente |
| Nuvens | 8 nuvens animadas em movimento circular |
| Terreno | Plano verde com grama procedural |
| Névoa | Fade de 500-1000 unidades |
| Iluminação | Ambiente + Direcional com sombras |

### 8.3 Grama Procedural

**Especificações:**
- 500.000 lâminas de grama
- Shader customizado com animação de onda
- Efeito de achatamento ao caminhar
- Gradiente de cores (base escura → ponta clara)

### 8.4 Efeitos Visuais (Planejados)

- Partículas de fogo para Fireball
- Ondas de distorção para Push Wave
- Spray de água para Water Jet
- Feedback de dano (flash vermelho)

---

## 9. Áudio

### 9.1 Efeitos Sonoros

| Som | Arquivo | Uso |
|-----|---------|-----|
| Passos | `walking-on-grass.mp3` | Caminhada (400ms intervalo) |
| Aterrissagem | `jump-fall.mp3` | Após pulo |

### 9.2 Sons Planejados

- Conjuração de feitiços
- Impacto de feitiços
- Dano ao jogador
- Morte de inimigos
- Música de fundo

### 9.3 Sistema de Áudio

- Three.js AudioListener para áudio posicional
- Carregamento assíncrono com Promises
- Controle de volume por categoria

---

## 10. Especificações Técnicas

### 10.1 Stack Tecnológico

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Three.js | 0.181.1 | Engine 3D |
| Vite | 7.2.2 | Build tool |
| Tailwind CSS | 4.1.17 | Estilização |
| Web Speech API | - | Reconhecimento de voz |

### 10.2 Requisitos do Sistema

**Mínimos:**
- Browser moderno (Chrome recomendado para voz)
- WebGL 2.0
- Microfone (para comandos de voz)
- Teclado e Mouse

### 10.3 Parâmetros do Jogo

| Parâmetro | Valor |
|-----------|-------|
| FOV | 75° |
| Tamanho do Mapa | 100x100 unidades |
| Shadow Map | 2048x2048 |
| Target FPS | 60 |

### 10.4 Arquitetura

```
src/
├── classes/
│   ├── Game.js              # Game loop principal
│   ├── GameScene.js         # Cena 3D e mundo
│   ├── Player.js            # Controlador do jogador
│   ├── InputManager.js      # Entrada de teclado/mouse
│   ├── SpeechRecognitionManager.js  # Reconhecimento de voz
│   ├── AudioManager.js      # Sistema de áudio
│   ├── GrassGenerator.js    # Gerador de grama
│   ├── GrassShader.js       # Shaders GLSL
│   └── FPSCounter.js        # Debug overlay
├── settings.js              # Configurações persistentes
└── main.js                  # Entry point
```

---

## 11. Roadmap de Desenvolvimento

### 11.1 Fase Atual: Core Gameplay ✅

- [x] Sistema de movimentação FPS
- [x] Sistema de pulo e gravidade
- [x] Colisão com barreiras
- [x] Sistema de vida do jogador
- [x] Reconhecimento de voz (captura)
- [x] Menu de configurações
- [x] Sistema de áudio básico
- [x] Grama procedural com shaders
- [x] Sistema de pausa

### 11.2 Em Desenvolvimento: Sistemas de Combate

#### Sistema de Feitiços ([#3](https://github.com/pedrovian4/magebonk/issues/3), [#4](https://github.com/pedrovian4/magebonk/issues/4))
- [ ] Estrutura base para feitiços
- [ ] Conjuração por voz funcional
- [ ] Feedback visual de reconhecimento

#### Fireball ([#5](https://github.com/pedrovian4/magebonk/issues/5))
- [ ] Visual da bola de fogo
- [ ] Movimento até colisão
- [ ] Explosão ao impacto
- [ ] Dano e knockback

#### Push Wave ([#6](https://github.com/pedrovian4/magebonk/issues/6))
- [ ] Área circular no jogador
- [ ] Empurrão proporcional
- [ ] Feedback visual

#### Water Jet ([#7](https://github.com/pedrovian4/magebonk/issues/7))
- [ ] Fluxo contínuo
- [ ] Empurrão constante
- [ ] Balanceamento de recurso

### 11.3 Próxima Fase: Sistema de Inimigos

#### Base de Inimigos ([#8](https://github.com/pedrovian4/magebonk/issues/8))
- [ ] Estrutura padrão de inimigo
- [ ] Ciclo de vida (spawn → morte)
- [ ] Parâmetros configuráveis
- [ ] Registro de inimigos ativos

#### IA e Comportamento ([#9](https://github.com/pedrovian4/magebonk/issues/9))
- [ ] Estados: Idle, Perseguindo, Atacando, Atordoado, Morto
- [ ] Transições lógicas

#### Dano e Knockback ([#10](https://github.com/pedrovian4/magebonk/issues/10))
- [ ] Função `levarDano(valor)`
- [ ] Função `sofrerKnockback(força, direção)`
- [ ] Morte quando vida ≤ 0
- [ ] Feedback visual

#### Detecção do Player ([#11](https://github.com/pedrovian4/magebonk/issues/11))
- [ ] Detecção por distância
- [ ] Campo de visão opcional
- [ ] Eventos de encontro/perda

### 11.4 Melhorias de UI

#### Menu de Pause ([#1](https://github.com/pedrovian4/magebonk/issues/1))
- [ ] Menu aparece ao sair do jogo
- [ ] Opções de continuar/sair

---

## Equipe

**Desenvolvedores:** 5

**Ferramentas:**
- Sistema Operacional: Windows/Linux
- IDE: VS Code
- Engine: Three.js

---

## Histórico de Versões

| Versão | Data | Descrição |
|--------|------|-----------|
| 0.1.0 | - | Core gameplay, movimentação, grama procedural |
| 0.2.0 | - | Reconhecimento de voz, sistema de pausa |
| 0.3.0 | - | (Planejado) Sistema de feitiços |
| 0.4.0 | - | (Planejado) Sistema de inimigos |
| 1.0.0 | - | (Planejado) Release inicial jogável |

---

*MageBonk - Fale suas magias, domine a arena.*
