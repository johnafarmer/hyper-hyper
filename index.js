let hyperHyperInstances = new WeakMap();
let globalHyperHyperInstance = null;

exports.decorateTerm = (Term, { React, notify }) => {
  return class extends React.Component {
    constructor(props, context) {
      super(props, context);
      this._onTerminal = this._onTerminal.bind(this);
      this._onCursorMove = this._onCursorMove.bind(this);
      this._resizeCanvas = this._resizeCanvas.bind(this);
      this._draw = this._draw.bind(this);
      
      this.state = {
        isActive: false
      };
      
      this.canvas = null;
      this.ctx = null;
      this.term = null;
      this.termDiv = null;
      this.typingTimer = null;
      this.animationId = null;
      this.lastContent = '';
      this.opacity = 0;
      this.targetOpacity = 0;
      this.time = 0;
    }

    _onTerminal(term) {
      if (this.props.onTerminal) {
        this.props.onTerminal(term);
      }
      this.term = term;
      this.termDiv = term.div_;
      
      if (this.termDiv) {
        hyperHyperInstances.set(this.termDiv, this);
        this.termDiv.hyperHyperInstance = this;
      }
      
      globalHyperHyperInstance = this;
      
      setTimeout(() => {
        if (this.canvas) {
          this._resizeCanvas();
          this._startContentMonitoring();
        }
      }, 100);
    }

    _onCursorMove() {
      if (this.props.onCursorMove) {
        this.props.onCursorMove();
      }
      this.triggerTyping();
    }

    triggerTyping() {
      if (!this.state.isActive) {
        this.setState({ isActive: true });
        this.targetOpacity = 1;
      }
      
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(() => {
        this.setState({ isActive: false });
        this.targetOpacity = 0;
      }, 1500);
    }

    _startContentMonitoring() {
      this.contentInterval = setInterval(() => {
        if (this.term && this.term.term) {
          const currentContent = this.term.term.buffer.active.getLine(
            this.term.term.buffer.active.cursorY
          );
          
          if (currentContent && currentContent.translateToString) {
            const contentStr = currentContent.translateToString();
            if (contentStr !== this.lastContent) {
              this.lastContent = contentStr;
              this.triggerTyping();
            }
          }
        }
      }, 100);
    }

    _resizeCanvas() {
      if (this.canvas && this.termDiv) {
        const rect = this.termDiv.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
      }
    }

    _draw() {
      if (!this.ctx || !this.canvas) {
        this.animationId = requestAnimationFrame(this._draw);
        return;
      }

      const config = this.props.hyperHyper || {};
      const colors = config.colors || ['#45847b', '#3ac28d', '#008787', '#2eb398', '#66d4aa'];
      const width = this.canvas.width;
      const height = this.canvas.height;
      
      this.ctx.clearRect(0, 0, width, height);
      
      const deltaOpacity = (this.targetOpacity - this.opacity) * 0.1;
      this.opacity += deltaOpacity;
      
      if (this.opacity > 0.01) {
        this.time += 0.02;
        
        const borderWidth = 2;
        const waveAmplitude = 1;
        const glowRadius = 12;
        
        const gradientPosition = (this.time * 50) % (width * 2 + height * 2);
        
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        
        this.ctx.shadowBlur = glowRadius;
        this.ctx.lineWidth = borderWidth;
        
        const drawBorder = (offset) => {
          this.ctx.beginPath();
          
          // Top edge
          this.ctx.moveTo(0, borderWidth/2);
          for (let x = 0; x <= width; x += 5) {
            const wave = Math.sin((x * 0.02) + this.time + offset) * waveAmplitude;
            this.ctx.lineTo(x, borderWidth/2 + wave);
          }
          
          // Right edge
          for (let y = 0; y <= height; y += 5) {
            const wave = Math.cos((y * 0.02) + this.time * 1.3 + offset) * waveAmplitude;
            this.ctx.lineTo(width - borderWidth/2 - wave, y);
          }
          
          // Bottom edge
          for (let x = width; x >= 0; x -= 5) {
            const wave = Math.sin((x * 0.02) + this.time * 0.7 + offset) * waveAmplitude;
            this.ctx.lineTo(x, height - borderWidth/2 - wave);
          }
          
          // Left edge
          for (let y = height; y >= 0; y -= 5) {
            const wave = Math.cos((y * 0.02) + this.time * 1.1 + offset) * waveAmplitude;
            this.ctx.lineTo(borderWidth/2 + wave, y);
          }
          
          this.ctx.closePath();
          
          // Create gradient that moves around the frame
          const gradient = this.ctx.createLinearGradient(
            Math.cos(this.time * 0.5) * width/2 + width/2,
            Math.sin(this.time * 0.5) * height/2 + height/2,
            Math.cos(this.time * 0.5 + Math.PI) * width/2 + width/2,
            Math.sin(this.time * 0.5 + Math.PI) * height/2 + height/2
          );
          
          // Distribute colors evenly across the gradient
          colors.forEach((color, index) => {
            const stop = index / (colors.length - 1);
            gradient.addColorStop(stop, color);
          });
          
          this.ctx.strokeStyle = gradient;
          this.ctx.shadowColor = colors[0];
          this.ctx.stroke();
        };
        
        // Draw multiple layers for depth
        this.ctx.globalAlpha = this.opacity * 0.3;
        drawBorder(0);
        
        this.ctx.globalAlpha = this.opacity * 0.6;
        this.ctx.shadowBlur = glowRadius * 0.7;
        drawBorder(Math.PI / 3);
        
        this.ctx.globalAlpha = this.opacity;
        this.ctx.shadowBlur = glowRadius * 0.5;
        drawBorder(Math.PI * 2 / 3);
        
        this.ctx.restore();
      }
      
      this.animationId = requestAnimationFrame(this._draw);
    }

    componentDidMount() {
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
        this._resizeCanvas();
        this._draw();
      }
      
      window.addEventListener('resize', this._resizeCanvas);
    }

    componentWillUnmount() {
      if (this.typingTimer) {
        clearTimeout(this.typingTimer);
      }
      
      if (this.contentInterval) {
        clearInterval(this.contentInterval);
      }
      
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      
      if (this.termDiv) {
        hyperHyperInstances.delete(this.termDiv);
        delete this.termDiv.hyperHyperInstance;
      }
      
      if (globalHyperHyperInstance === this) {
        globalHyperHyperInstance = null;
      }
      
      window.removeEventListener('resize', this._resizeCanvas);
    }

    render() {
      const config = this.props.hyperHyper || {};
      const colors = config.colors || ['#45847b', '#3ac28d', '#008787', '#2eb398', '#66d4aa'];
      const opacity = config.opacity || 0.8;
      const blur = config.blur || 0;
      
      return React.createElement(
        'div',
        { style: { width: '100%', height: '100%', position: 'relative' } },
        React.createElement(Term, Object.assign({}, this.props, {
          onTerminal: this._onTerminal,
          onCursorMove: this._onCursorMove
        })),
        React.createElement('canvas', {
          ref: (c) => { this.canvas = c; },
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: opacity,
            mixBlendMode: 'screen',
            zIndex: 100
          }
        }),
        React.createElement('style', {
          dangerouslySetInnerHTML: {
            __html: `
              .hyper-hyper-active .term_fit {
                background-color: transparent !important;
                ${blur > 0 ? `filter: blur(${blur}px);` : ''}
              }
              .term_fit {
                transition: all 0.3s ease;
              }
            `
          }
        })
      );
    }
  };
};

exports.decorateConfig = (config) => {
  return Object.assign({}, config, {
    hyperHyper: Object.assign({}, {
      colors: ['#45847b', '#3ac28d', '#008787', '#2eb398', '#66d4aa'],
      opacity: 0.8,
      blur: 0
    }, config.hyperHyper)
  });
};

exports.middleware = (store) => (next) => (action) => {
  if (action.type === 'SESSION_USER_DATA' || action.type === 'SESSION_PTY_DATA') {
    const activeSession = store.getState().sessions.activeUid;
    
    if (activeSession) {
      setTimeout(() => {
        if (globalHyperHyperInstance) {
          globalHyperHyperInstance.triggerTyping();
        } else {
          const instances = Array.from(hyperHyperInstances.values());
          instances.forEach(instance => {
            if (instance && instance.triggerTyping) {
              instance.triggerTyping();
            }
          });
        }
      }, 0);
    }
  }
  
  return next(action);
};