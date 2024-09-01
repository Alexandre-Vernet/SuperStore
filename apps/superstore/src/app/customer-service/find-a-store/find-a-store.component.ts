import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
    selector: 'superstore-find-a-store',
    templateUrl: './find-a-store.component.html',
    styleUrls: ['./find-a-store.component.scss']
})
export class FindAStoreComponent implements OnInit {

    stores = [
        {
            address: '6 Pl. Roger Salengro, 31000 Toulouse',
            coordinates: [43.60292853822518, 1.445116255839417]
        },
        {
            address: '345 Av. Jean Rieux, 31500 Toulouse',
            coordinates: [43.57926113139877, 1.4841020608878694]
        },
        {
            address: 'Lieu dit La Caussade, 3 Av. de Toulouse, 31240 L\'Union',
            coordinates: [43.650170533138564, 1.4688032067983512]
        },
        {
            address: '75 Av. des États-Unis, 31200 Toulouse',
            coordinates: [43.631637517554125, 1.4318966465589344]
        },
        {
            address: '5 Rue Joachim du Bellay, 31100 Toulouse',
            coordinates: [43.58540556389658, 1.405078826359399]
        },
        {
            address: '77 Allée Jean Jaurès BAL82, 31000 Toulouse',
            coordinates: [43.609480466452865, 1.453452252627685]
        }
    ];

    ngOnInit() {
        const icon = L.icon({
            iconUrl: 'assets/leaflet/placeholder.png',
            shadowUrl: 'assets/leaflet/placeholder.png',

            iconSize: [50, 50],
            shadowSize: [0, 0],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76]
        });

        const map = L.map('map').setView([43.61688491566933, 1.4419926337606648], 12.5);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        this.stores.forEach(c => {
            L.marker(c.coordinates, { icon }).addTo(map)
                .bindPopup(c.address);
        });
    }
}
