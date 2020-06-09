
export const Bonificacion = {
    NINGUNA: {
        tiempo: 0,
        aplicar: (jugador) => {

        },
        quitar: (jugador) => {

        }
    },
    VELOCIDAD: {
        tiempo: 25,
        aplicar: (jugador) => {

        },
        quitar: (jugador) => {

        }
    },
    VIDA: {
        tiempo: 20,
        aplicar: (jugador) => {
            document.getElementById("#bonificacion").innerText = "Vida extra";
        },
        quitar: (jugador) => {

        }
    },
    MULTIPLICADOR: {
        tiempo: 15,
        aplicar: (jugador) => {

        },
        quitar: (jugador) => {

        }
    },
}