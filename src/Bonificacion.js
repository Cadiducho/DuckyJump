
export const Bonificacion = {
    NINGUNA: {
        tiempo: 0,
        nombre: "Ninguna",
        aplicar: (jugador) => {

        },
        quitar: (jugador) => {

        }
    },
    VELOCIDAD: {
        tiempo: 5,
        nombre:"Mas Velocidad",
        aplicar: (jugador) => {
            jugador.t_velocidad = 100;
        },
        quitar: (jugador) => {
            jugador.t_velocidad = 400;
        }
    },
    MULTIPLICADOR: {
        tiempo: 5,
        nombre: "Multiplicador de Puntos",
        aplicar: (jugador) => {
            jugador.multiplicidad++;
        },
        quitar: (jugador) => {
            jugador.multiplicidad = 1;
        }
    },
    GIGANTE: {
        tiempo: 5,
        nombre: "Gigante",
        aplicar: (jugador) => {
            jugador.duck.scale.set(1,1,1);
        },
        quitar: (jugador) => {
            jugador.duck.scale.set(0.5,0.5,0.5);
        }
    }
}