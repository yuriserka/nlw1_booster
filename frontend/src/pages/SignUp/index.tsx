import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import Axios from 'axios';

interface CollectionItem {
  id: number;
  name: string,
  image_url: string;
}

interface City {
  id: number;
  name: string;
}

interface Ufs {
  id: number;
  initials: string;
}

const SignUp: React.FC = () => {
  const history = useHistory();

  const [ufs, setUfs] = useState<Ufs[]>();
  const [cities, setCities] = useState<City[]>();
  const [avaibleItems, setItems] = useState<CollectionItem[]>();

  const [formData, setFormData] = useState<{ [key: string]: string; }>({
    name: '',
    email: '',
    whatsapp: '',
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedUf, setActualUf] = useState('0');
  const [selectedCity, setActualCity] = useState('0');
  const [initialPosition, setInitialPosition] = useState<[number, number]>();
  const [markerPosition, setMarker] = useState<[number, number]>();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  useEffect(() => {
    api.get('/items').then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    }, () => {
      console.log('Error getting position');
    }, {
      enableHighAccuracy: true,
      maximumAge: 50,
    });
  }, []);

  useEffect(() => {
    interface IBGEUFResponse {
      id: number;
      sigla: string
    };

    Axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
        setUfs(response.data.map((uf: IBGEUFResponse) => {
          return {
            id: uf.id,
            initials: uf.sigla,
          };
        }));
      });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    interface IBGEMunicipioResponse {
      id: number;
      nome: string
    };

    Axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        setCities(response.data.map((municipio: IBGEMunicipioResponse) => {
          return {
            id: municipio.id,
            name: municipio.nome,
          };
        }));
      });
  }, [selectedUf]);

  function handleSelect(event: ChangeEvent<HTMLSelectElement>) {
    event.target.name === 'uf'
      ? setActualUf(event.target.value)
      : setActualCity(event.target.value);
  }

  function renderItems() {
    const items = avaibleItems ? avaibleItems.map(i => (
      <li
        key={String(i.id)}
        onClick={() => handleSelectItem(i.id)}
        className={selectedItems.includes(i.id) ? 'selected' : ''}
      >
        <img src={i.image_url} alt={i.name} />
        <span>{i.name}</span>
      </li>
    )) : (<h3>Sem items disponíveis</h3>);

    return (
      <ul className="items-grid">
        {items}
      </ul>
    );
  }

  function handleSelectItem(id: number) {
    setSelectedItems(
      selectedItems.findIndex(iid => iid === id) >= 0
        ? selectedItems.filter(iid => iid !== id)
        : [...selectedItems, id]
    );
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setMarker([
      event.latlng.lat,
      event.latlng.lng
    ]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (markerPosition) {
      const response = await api.post('/points', {
        name: formData.name,
        email: formData.email,
        phone: formData.whatsapp,
        city: selectedCity,
        uf: selectedUf,
        latitude: markerPosition[0],
        longitude: markerPosition[1],
        items: selectedItems,
      });

      if (response.status === 201) {
        alert('Ponto de coleta Cadastrado!');
        history.push('/');
      } else {
        alert('Falha ao salvar');
      }
    } else {
      alert('Por favor selecione uma localização.');
    }
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="e-coleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="name"
              id="name"
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                onChange={handleInputChange}
                type="text"
                name="email"
                id="email"
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                onChange={handleInputChange}
                type="text"
                name="whatsapp"
                id="whatsapp"
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map
            center={initialPosition}
            zoom={15}
            onclick={handleMapClick}
            attributionControl
            zoomControl
            doubleClickZoom
            scrollWheelZoom
            dragging
            animate
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markerPosition && <Marker position={markerPosition} draggable />}
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" value={selectedUf} onChange={handleSelect}>
                <option value="0">Selecione uma UF</option>
                {
                  ufs?.map(uf => (
                    <option
                      key={uf.id}
                      value={uf.initials}
                    >
                      {uf.initials}
                    </option>
                  ))
                }
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" value={selectedCity} onChange={handleSelect}>
                <option value="0">Selecione uma cidade</option>
                {
                  cities?.map(city => (
                    <option
                      key={city.id}
                      value={city.name}
                    >
                      {city.name}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          {renderItems()}
        </fieldset>

        <button type="submit">
          Salvar
        </button>
      </form>
    </div>
  );
}

export default SignUp;
