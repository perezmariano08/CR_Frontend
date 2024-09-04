import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`
    :root {
        --red: #EF4444;
        --green: #2AD174;
        --green-opacity: rgba(42, 209, 116, 0.2);;
        /* Gray Scale */
        --white: #fafafa;
        --gray-200: #65656B;
        --gray-300: #2D2F30;
        --gray-400: #1A1B1B;
        --gray-500: #101011;
        --black: #121212;
        --yellow: #E2B000;

        --green-win: #00985F;
        
        --success: #22C55E;
        --danger: #EF4444;
        --import: #6366F1;
        --export: #A855F7
    }
    

    html {
        scroll-behavior: smooth;
    }

    img {
        user-select: none;
    }

    body {
        color: var(--white);
        height: auto !important;
    }

    /* Aplica estilos a los campos autocompletados */
    input:-webkit-autofill,
    textarea:-webkit-autofill,
    select:-webkit-autofill {
        background: red !important;
        color: var(--white) !important;
        border: 1px solid var(--gray-300) !important;
        border-radius: 6px;
        box-shadow: 0 0 0px 1000px var(--gray-300) inset !important;
        transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
    }

    /* Aplica estilos a los campos autocompletados cuando tienen el foco */
    input:-webkit-autofill:focus,
    textarea:-webkit-autofill:focus,
    select:-webkit-autofill:focus {
        box-shadow: 0 0 0px 1000px var(--gray-300) inset !important;
        border-color: var(--green) !important;
    }


    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        text-decoration: none;
        list-style-type: none;
        font-family: 'Mulish', sans-serif;
        font-weight: 400;
        font-style: normal;
    }

    

    .no-scroll {
        overflow: hidden;
    }

    .container {
        width: 100%;
    }

    .wrapper {
        width: 100%;
        display: flex;
        padding-bottom: 140px;

        @media (min-width: 300px) {
            padding: 30px 15px 140px 15px;
        }

        @media (min-width: 400px) {
            padding: 30px 20px 140px 20px;
        }
    }

    .MuiPaper-root {
        & > div {
            background-color: var(--gray-300);

            .MuiButtonBase-root {
                color: var(--white);
            }

            .Mui-selected {
                
                td {
                    background-color: var(--green-opacity);
                    color: var(--green) !important;
                }
            }
        }   
        & th, td {
            background-color: transparent;
            color: var(--white) !important;
            padding: 10px 15px;
            height: auto;
            border-color: var(--gray-200);
        }
    }

    .p-dropdown-panel {
        background-color: var(--gray-300);
        border-radius: 10px;

        & .p-dropdown-items-wrapper .p-dropdown-items {
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
    }


    .p-datepicker {
        background-color: var(--gray-300);
        padding: 10px;
        position: absolute;
        z-index: 1001;
        transform-origin: center bottom;
        border: 0 none;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        .p-datepicker-group-container {

        .p-datepicker-group {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .p-datepicker-header {
                padding: 0.5rem;
                color: #4b5563;
                font-weight: 600;
                margin: 0;
                border-bottom: 1px solid var(--gray-200);
                border-top-right-radius: 6px;
                border-top-left-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .p-datepicker-prev, .p-datepicker .p-datepicker-header .p-datepicker-next {
                    width: 2rem;
                    height: 2rem;
                    color: var(--gray-200);
                    border: 0 none;
                    background: transparent;
                    border-radius: 50%;
                    transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
                }

                .p-datepicker-prev, .p-datepicker-next {
                    cursor: pointer;
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    position: relative;
                }

                .p-datepicker-title {
                    margin: 0 auto;
                    .p-datepicker-year, .p-datepicker .p-datepicker-header .p-datepicker-title .p-datepicker-month {
                        color: var(--white);
                        transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
                        font-weight: 600;
                        padding: 0.5rem;
                    }
                    .p-datepicker-month {
                        color: var(--gray-200);
                        transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
                        font-weight: 600;
                        padding: 0.5rem;
                        text-transform: uppercase;
                    }
                }

                .p-datepicker-next {
                    width: 2rem;
                    height: 2rem;
                    color: var(--gray-200);
                    border: 0 none;
                    background: transparent;
                    border-radius: 50%;
                    transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
                }

                .p-datepicker-decade {
                    span {
                        color: var(--gray-200);
                    }
                }
            }

            .p-datepicker-calendar-container {
                table {
                    width: 100%;
                    border-collapse: collapse;

                    th {
                        padding: .5rem;

                        span {
                            font-weight: 600;
                            color: var(--green);
                        }
                    }

                    td {
                        padding: 0.5rem;
                    }

                    .p-datepicker-other-month {
                        color: var(--gray-200);
                        span {
                            font-weight: 200;
                        }
                        
                    }
                }
            }
        }
    }
        .p-monthpicker {
            margin: 0.5rem 0;
            .p-monthpicker-month {
                padding: 0.5rem;
                transition: box-shadow 0.2s;
                border-radius: 6px;
            }
        }

        .p-yearpicker {
            margin: 0.5rem 0;
            .p-yearpicker-year {
                padding: 0.5rem;
                transition: box-shadow 0.2s;
                border-radius: 6px;
            }
        }
    }

    .p-toast {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        svg {
            font-size: 10px;
        }
    }

    .p-datatable.p-component.p-datatable-selectable.p-datatable-responsive-scroll {
        background-color: var(--gray-300) !important;
    }

    .p-paginator-bottom {
        background-color: var(--gray-300);

        .p-paginator-page {
            border: none;
        }

        .p-paginator-page.p-highlight {
            border: 1px solid var(--green);
        }
    }
        
    /* Estilos de barra de desplazamiento */
    ::-webkit-scrollbar {
        height: 8px; /* Altura de la barra de desplazamiento */
    }

    ::-webkit-scrollbar-track {
        background: var(--gray-300); /* Color de fondo de la pista */
        border-radius: 10px; /* Bordes redondeados de la pista */
    }

    ::-webkit-scrollbar-thumb {
        background: var(--gray-200); /* Color del pulgar */
        border-radius: 10px; /* Bordes redondeados del pulgar */
        transition: all 0.3s ease; /* Transición suave para todas las propiedades */
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--gray-500); /* Color del pulgar al pasar el ratón por encima */
    }
    
    /* En un archivo CSS separado o dentro de un componente styled-components */
    .p-calendar input {
        font-size: 14px;
    }
    .p-calendar input::placeholder {
        color: var(--gray-200); /* Cambia este color al que prefieras */
        font-size: 14px;
    }
`


