import './root.css'

import bannerImage from '/banner.jpeg'

const Root = () => {
    return (
        <div className='root-container'>
            <h2 id="banner-subtitle">
                Bienvenido a Juez Online
            </h2>
            <h1 id="banner-title">
                Descubre el mundo de la programación competitiva
            </h1>
            <img src={bannerImage} alt="Banner" id='banner-image' />
            <div id="banner-carts-container">
                <div className="banner-cart-item">
                    <h3 className="banner-cart-title">
                        Olimpiada de Chilena de Informática
                    </h3>
                    <a href="/problems" className="banner-cart-button">
                        Ver problemas
                    </a>
                </div>
                <div className="banner-cart-item">
                    <h3 className="banner-cart-title">
                        Para comenzar
                    </h3>
                    <a href="/problems" className="banner-cart-button">
                        Ver problemas
                    </a>
                </div>
                <div className="banner-cart-item">
                    <h3 className="banner-cart-title">
                        Problema de la semana
                    </h3>
                    <a href="/problems" className="banner-cart-button">
                        Ver problemas
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Root;
