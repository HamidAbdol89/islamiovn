// src/data/mosqueData.ts

import type { Mosque } from './mosque.types';

export const mosqueData: Mosque[] = [
    // SOUTHERN REGION
    {
        id: '1',
        name: 'Masjid Jamiul Muslimin',
        address: '66 Tran Hung Dao Street, District 1',
        city: 'Ho Chi Minh City',
        image: '/images/masjid/jamiul-muslimin.webp',
        region: 'Southern',
        phone: '+84 28 3838 1919',
        capacity: 2000,
        foundedYear: 1932,
        description: 'Central mosque of the Muslim community in Ho Chi Minh City.'
    },
    {
        id: '2',
        name: 'Masjid Al-Noor',
        address: '123 Nguyen Van Cu Street, District 5',
        city: 'Ho Chi Minh City',
        region: 'Southern',
        phone: '+84 28 3835 1234',
        website: 'https://masjid-alnoor.vn',
        capacity: 1500,
        foundedYear: 1935,
        image: '/images/masjid/al-noor.webp',
        prayerTimes: {
            fajr: '04:45',
            dhuhr: '12:00',
            asr: '15:30',
            maghrib: '18:15',
            isha: '19:30'
        },
        description: 'One of the oldest mosques in Ho Chi Minh City, serving the Muslim community since 1935.',
        facilities: ['Islamic library', 'Quran classes', 'Halal kitchen', 'Parking area']
    },
    {
        id: '3',
        name: 'Masjid Al-Rahim',
        address: '45 Hung Vuong Street, District 5',
        city: 'Ho Chi Minh City',
        region: 'Southern',
        capacity: 800,
        foundedYear: 1960
    },
    {
        id: '4',
        name: 'Masjid An-Nahdhah',
        address: '12 Le Van Sy Street, Ward 13, District 3',
        city: 'Ho Chi Minh City',
        region: 'Southern',
        phone: '+84 28 3930 4545',
        capacity: 500
    },
    {
        id: '5',
        name: 'Masjid Al-Ehsan',
        address: '30/4 Street, Ward 1',
        city: 'Vung Tau',
        region: 'Southern',
        capacity: 300,
        foundedYear: 1985
    },
    {
        id: '6',
        name: 'Masjid Al-Huda',
        address: 'Bau Lach Hamlet, Tan Hoa Village',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 200
    },
    {
        id: '7',
        name: 'Masjid Al-Iman',
        address: 'Quarter 4, Long Binh Ward',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 150
    },
    {
        id: '8',
        name: 'Masjid Al-Taqwa',
        address: 'Nguyen Trai Street, Ward 1',
        city: 'My Tho',
        region: 'Southern',
        capacity: 250
    },
    {
        id: '9',
        name: 'Masjid Al-Falah',
        address: 'Ward 2, Bac Lieu City',
        city: 'Bac Lieu',
        region: 'Southern',
        capacity: 400,
        foundedYear: 1950,
        description: 'Largest mosque in Bac Lieu.'
    },
    {
        id: '10',
        name: 'Masjid Al-Karim',
        address: 'Ward 5, Soc Trang City',
        city: 'Soc Trang',
        region: 'Southern',
        capacity: 600,
        foundedYear: 1940
    },
    {
        id: '11',
        name: 'Masjid Al-Nur',
        address: 'Ward 3, Can Tho City',
        city: 'Can Tho',
        region: 'Southern',
        capacity: 350
    },
    {
        id: '12',
        name: 'Masjid Al-Amin',
        address: 'Ward 8, Vinh Long City',
        city: 'Vinh Long',
        region: 'Southern',
        capacity: 200
    },
    {
        id: '13',
        name: 'Masjid Al-Hidayah',
        address: 'Ward 1, Tra Vinh City',
        city: 'Tra Vinh',
        region: 'Southern',
        capacity: 300
    },
    {
        id: '14',
        name: 'Masjid Al-Ikhlas',
        address: 'Ward 2, Ben Tre City',
        city: 'Ben Tre',
        region: 'Southern',
        capacity: 180
    },
    {
        id: '15',
        name: 'Masjid Al-Muhajirin',
        address: 'Ward 4, Long Xuyen City',
        city: 'Long Xuyen',
        region: 'Southern',
        capacity: 220
    },
    {
        id: '16',
        name: 'Masjid Al-Muttaqin',
        address: 'Ward 3, Rach Gia City',
        city: 'Rach Gia',
        region: 'Southern',
        capacity: 280
    },
    {
        id: '17',
        name: 'Masjid Al-Rahma',
        address: 'Ward 5, Cao Lanh City',
        city: 'Cao Lanh',
        region: 'Southern',
        capacity: 150
    },
    {
        id: '18',
        name: 'Masjid Al-Salam',
        address: 'Ward 1, Sa Dec City',
        city: 'Sa Dec',
        region: 'Southern',
        capacity: 120
    },
    {
        id: '19',
        name: 'Masjid Al-Tawhid',
        address: 'Ward 2, Ha Tien City',
        city: 'Ha Tien',
        region: 'Southern',
        capacity: 100
    },
    {
        id: '20',
        name: 'Masjid Al-Ummah',
        address: 'Ward 4, Chau Doc City',
        city: 'Chau Doc',
        region: 'Southern',
        capacity: 500,
        foundedYear: 1975,
        description: 'Important mosque for the Cham community in Chau Doc.'
    },
    // Surau (small mosques)
    {
        id: '21',
        name: 'Surau Al-Ikhlas',
        address: 'Alley 45, Le Duan Street, District 1',
        city: 'Ho Chi Minh City',
        region: 'Southern',
        capacity: 50
    },
    {
        id: '22',
        name: 'Surau An-Nur',
        address: 'Quarter 2, Tan Chanh Hiep Ward, District 12',
        city: 'Ho Chi Minh City',
        region: 'Southern',
        capacity: 40
    },
    {
        id: '23',
        name: 'Surau Ar-Rahman',
        address: 'Phuoc Hoa Hamlet, Long Thoi Village',
        city: 'Nha Be',
        region: 'Southern',
        capacity: 30
    },
    {
        id: '24',
        name: 'Surau Al-Falah',
        address: 'Bien Hoa Industrial Zone 2',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 60
    },
    {
        id: '25',
        name: 'Surau Al-Huda',
        address: 'Quarter 3, Tan Phong Ward',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 35
    },
    {
        id: '26',
        name: 'Surau Al-Muhajirin',
        address: 'Long Binh Tan Ward',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 25
    },
    {
        id: '27',
        name: 'Surau Al-Quds',
        address: 'Amata Industrial Park',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 45
    },
    {
        id: '28',
        name: 'Surau Al-Salam',
        address: 'Quarter 4, Tan Van Ward',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 30
    },
    {
        id: '29',
        name: 'Surau Al-Taqwa',
        address: 'Quarter 5, Ho Nai Ward',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 40
    },
    {
        id: '30',
        name: 'Surau An-Nasr',
        address: 'Loteco Industrial Park',
        city: 'Long Thanh',
        region: 'Southern',
        capacity: 50
    },
    {
        id: '31',
        name: 'Surau Ar-Raudah',
        address: 'Quarter 6, Tam Phuoc Ward',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 20
    },
    {
        id: '32',
        name: 'Surau Al-Kauthar',
        address: 'Nhon Trach Industrial Zone 2',
        city: 'Nhon Trach',
        region: 'Southern',
        capacity: 55
    },
    {
        id: '33',
        name: 'Surau Al-Ma\'arif',
        address: 'Quarter 7, Long Binh Ward',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 25
    },
    {
        id: '34',
        name: 'Surau Al-Munawwarah',
        address: 'Song Than Industrial Zone 1',
        city: 'Di An',
        region: 'Southern',
        capacity: 60
    },
    {
        id: '35',
        name: 'Surau An-Najah',
        address: 'Quarter 8, Tan Hiep Ward',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 30
    },
    {
        id: '36',
        name: 'Surau Ar-Riyadh',
        address: 'Vietnam-Singapore Industrial Park',
        city: 'Thuan An',
        region: 'Southern',
        capacity: 70
    },
    {
        id: '37',
        name: 'Surau Al-Fath',
        address: 'Quarter 9, Tan Hoa Ward',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 20
    },
    {
        id: '38',
        name: 'Surau Al-Hidayah',
        address: 'Dong An Industrial Park',
        city: 'Ben Cat',
        region: 'Southern',
        capacity: 50
    },
    {
        id: '39',
        name: 'Surau Al-Ihsan',
        address: 'Quarter 10, Tan Mai Ward',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 25
    },
    {
        id: '40',
        name: 'Surau Al-Jannah',
        address: 'My Phuoc Industrial Park 3',
        city: 'Ben Cat',
        region: 'Southern',
        capacity: 65
    },
    {
        id: '41',
        name: 'Surau Al-Mubarak',
        address: 'Quarter 11, Hoa An Ward',
        city: 'Bien Hoa',
        region: 'Southern',
        capacity: 30
    },

    // NORTHERN REGION
    {
        id: 'n1',
        name: 'Masjid Al-Noor Hanoi',
        address: '12 Hang Luoc, Hang Ma Ward, Hoan Kiem District',
        city: 'Hanoi',
        region: 'Northern',
        phone: '+84 24 3825 1919',
        capacity: 500,
        foundedYear: 1890,
        description: 'The only mosque in central Hanoi, serving the small Muslim community here.',
        facilities: ['Halal kitchen', 'Wudu area', 'Small library'],
    },
    {
        id: 'n2',
        name: 'Masjid Al-Islam',
        address: '44 Hang Cot Street, Hoan Kiem District',
        city: 'Hanoi',
        region: 'Northern',
        capacity: 300,
        foundedYear: 1950,
        description: 'One of the few mosques in Hanoi, mainly serving foreigners and the small Cham community.',
    },
    {
        id: 'n3',
        name: 'Hai Phong Mosque',
        address: 'Lach Tray Street, Ngo Quyen District',
        city: 'Hai Phong',
        region: 'Northern',
        capacity: 200,
        foundedYear: 1980,
        description: 'Main mosque in Hai Phong, serving the local Muslim community and foreigners.',
    },
    {
        id: 'n4',
        name: 'Nam Dinh Mosque',
        address: 'Ben Ngu Street, Loc Vuong Ward',
        city: 'Nam Dinh',
        region: 'Northern',
        capacity: 150,
        description: 'Small mosque serving the Muslim community in Nam Dinh.',
    },
    {
        id: 'n5',
        name: 'Thai Binh Mosque',
        address: 'Tran Hung Dao Street, Quang Trung Ward',
        city: 'Thai Binh',
        region: 'Northern',
        capacity: 100,
        description: 'Small mosque serving the local Muslim community.',
    },
    {
        id: 'n6',
        name: 'Surau Al-Iman (Hanoi)',
        address: 'My Dinh Urban Area, Nam Tu Liem District',
        city: 'Hanoi',
        region: 'Northern',
        capacity: 50,
        description: 'Small prayer room serving the Indonesian and Malaysian community working in Hanoi.',
    },
    {
        id: 'n7',
        name: 'Surau Al-Taqwa (Hai Phong)',
        address: 'Nomura Industrial Park, Hai An District',
        city: 'Hai Phong',
        region: 'Northern',
        capacity: 40,
        description: 'Prayer room in the industrial park, mainly serving Muslim workers.',
    },
    {
        id: 'n8',
        name: 'Surau Al-Rahma (Quang Ninh)',
        address: 'Ha Long Urban Area, Bai Chay Ward',
        city: 'Ha Long',
        region: 'Northern',
        capacity: 30,
        description: 'Small prayer room for Muslim tourists and the local community.',
    },
    {
        id: 'n9',
        name: 'Surau Al-Nur (Bac Ninh)',
        address: 'VSIP Industrial Park, Thuan Thanh',
        city: 'Bac Ninh',
        region: 'Northern',
        capacity: 35,
        description: 'Prayer room in the industrial park, serving foreign workers.',
    },
    {
        id: 'n10',
        name: 'Surau Al-Huda (Hung Yen)',
        address: 'Pho Noi Industrial Park, Van Lam',
        city: 'Hung Yen',
        region: 'Northern',
        capacity: 25,
        description: 'Small prayer room in the industrial park.',
    },

    // CENTRAL REGION
    {
        id: 'c1',
        name: 'Masjid Al-Rahman',
        address: 'Bau Truc Village, Phuoc Dan Commune, Ninh Phuoc District',
        city: 'Ninh Thuan',
        region: 'Central',
        capacity: 800,
        foundedYear: 1960,
        description: 'Religious center for the Cham Muslim community in Ninh Thuan.',
        facilities: ['Quran classes', 'Wudu area', 'Parking area'],
    },
    {
        id: 'c2',
        name: 'Masjid Jamiul Anwar',
        address: 'Cham Village, Phan Ri Cua, Tuy Phong District',
        city: 'Binh Thuan',
        region: 'Central',
        capacity: 600,
        foundedYear: 1975,
        description: 'Main mosque of the Cham Muslim community in Binh Thuan.',
    },
    {
        id: 'c3',
        name: 'Masjid Al-Ihsan',
        address: 'Van Lam Village, An Hai Commune, Ninh Phuoc District',
        city: 'Ninh Thuan',
        region: 'Central',
        capacity: 400,
    },
    {
        id: 'c4',
        name: 'Masjid Al-Noor Phan Rang',
        address: '16 April Street, Do Vinh Ward',
        city: 'Phan Rang - Thap Cham',
        region: 'Central',
        capacity: 500,
    },
    {
        id: 'c5',
        name: 'Masjid Al-Taqwa',
        address: 'Hoa Lac Village, An Dan Commune, Tuy An District',
        city: 'Phu Yen',
        region: 'Central',
        capacity: 300,
        description: 'Serving the local Cham Muslim community.',
    },
    {
        id: 'c6',
        name: 'Masjid Al-Hidayah',
        address: 'Phu Truong Village, Suoi Tan Commune, Cam Lam District',
        city: 'Khanh Hoa',
        region: 'Central',
        capacity: 200,
    },
    {
        id: 'c7',
        name: 'Masjid Al-Ehsan',
        address: '156 Tran Phu Street, Hai Chau District',
        city: 'Da Nang',
        region: 'Central',
        phone: '+84 236 3821 567',
        capacity: 150,
        description: 'The only mosque in Da Nang, serving Muslim tourists and the small Indonesian and Malaysian community.',
        facilities: ['Halal kitchen', 'Small library'],
    },
    {
        id: 'c8',
        name: 'Surau Al-Iman',
        address: 'An Don Industrial Park, Son Tra District',
        city: 'Da Nang',
        region: 'Central',
        capacity: 50,
        description: 'For Muslim workers in An Don Industrial Park.',
    },
    {
        id: 'c9',
        name: 'Surau Al-Falah',
        address: 'Hoa Khanh Industrial Park, Lien Chieu District',
        city: 'Da Nang',
        region: 'Central',
        capacity: 40,
    },
    {
        id: 'c10',
        name: 'Surau Al-Nur',
        address: 'Dong Nam Industrial Park, Quy Nhon City',
        city: 'Binh Dinh',
        region: 'Central',
        capacity: 30,
    },
];

export default mosqueData;