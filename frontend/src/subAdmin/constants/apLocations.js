import apiClient from '../../api/axios'

export const apDistricts = [
  "Alluri Sitharama Raju",
  "Anakapalli",
  "Anantapur",
  "Annamayya",
  "Bapatla",
  "Chittoor",
  "East Godavari",
  "Eluru",
  "Guntur",
  "Kakinada",
  "Konaseema",
  "Krishna",
  "Kurnool",
  "Nandyal",
  "NTR",
  "Palnadu",
  "Parvathipuram Manyam",
  "Prakasam",
  "SPS Nellore",
  "Sri Balaji (Tirupati)",
  "Sri Sathya Sai",
  "Srikakulam",
  "Visakhapatnam",
  "Vizianagaram",
  "West Godavari",
  "YSR Kadapa",
  "Other"
];

// Representative mandal list across Andhra Pradesh. Extendable if you need more.
export const apMandals = [
  "Addanki",
  "Adoni",
  "Ainavilli",
  "Akividu",
  "Alamuru",
  "Allagadda",
  "Amadalavalasa",
  "Amalapuram",
  "Amaravathi",
  "Anakapalli",
  "Anantapur",
  "Anaparthi",
  "Anantagiri",
  "Annavaram",
  "Araku Valley",
  "Atchampeta",
  "Atmakur (Nellore)",
  "Atmakur (Nandyal)",
  "Attili",
  "Avanigadda",
  "Badvel",
  "Banaganapalli",
  "Bangarupalem",
  "Bapatla",
  "Bapulapadu",
  "Bathalapalle",
  "Bellamkonda",
  "Bestavaripeta",
  "Bhattiprolu",
  "Bheemunipatnam",
  "Bhimadole",
  "Bhimavaram",
  "Biccavolu",
  "Bobbili",
  "Bondapalli",
  "Bukkapatnam",
  "Chagallu",
  "Chandragiri",
  "Chebrolu",
  "Cheepurupalli",
  "Chilakaluripet",
  "Chinnamandyam",
  "Chintalapudi",
  "Chintapalle",
  "Chippagiri",
  "Chirala",
  "Chittoor",
  "Chodavaram",
  "Darsi",
  "Devarapalli",
  "Dharmavaram",
  "Dhone",
  "Dornala",
  "Dwaraka Tirumala",
  "Dwarakatirumala",
  "Duggirala",
  "Dummugudem",
  "Elamanchili",
  "Eluru",
  "Etcherla",
  "Ganapavaram",
  "Gannavaram",
  "Garladinne",
  "Giddalur",
  "Gokavaram",
  "Gooty",
  "Gopalapuram",
  "Gorantla",
  "Gudibanda",
  "Gudivada",
  "Gudur",
  "Guntakal",
  "Guntur",
  "Hindupur",
  "Hiramandalam",
  "Hukumpeta",
  "Ibrahimpatnam",
  "Ichchapuram",
  "Jaggampeta",
  "Jaggayyapeta",
  "Jammalamadugu",
  "Kalyandurg",
  "Kanchili",
  "Kandukur",
  "Kanigiri",
  "Kankipadu",
  "Kapileswarapuram",
  "Kasinayana",
  "Kasimkota",
  "Kaikaluru",
  "Kavali",
  "Kaviti",
  "Kaza",
  "Kothapeta",
  "Kothavalasa",
  "Kovvur",
  "Krosuru",
  "Kuppam",
  "Kurnool",
  "Macherla",
  "Machilipatnam",
  "Madanapalle",
  "Madhira",
  "Madnur",
  "Madakasira",
  "Mandapeta",
  "Mangalagiri",
  "Markapur",
  "Medikonduru",
  "Mogalthur",
  "Moinabad",
  "Mudigubba",
  "Mulakalacheruvu",
  "Mummidivaram",
  "Mydukur",
  "Nagalapuram",
  "Nagayalanka",
  "Nakkapalli",
  "Nallajerla",
  "Nandavaram",
  "Nandigama",
  "Nandikotkur",
  "Nandyal",
  "Narasannapeta",
  "Narasaraopet",
  "Narasapuram",
  "Nellimarla",
  "Nellore",
  "Nellore Rural",
  "Nidadavole",
  "Nuzvid",
  "Ongole",
  "Palacole",
  "Palakollu",
  "Palakonda",
  "Palamaner",
  "Palasa",
  "Palasa Kasibugga",
  "Palkonda",
  "Pamarru",
  "Pamulapadu",
  "Pamuru",
  "Panyam",
  "Paravada",
  "Parvathipuram",
  "Pattikonda",
  "Payakaraopeta",
  "Pedakurapadu",
  "Peddapuram",
  "Penamaluru",
  "Penukonda",
  "Penumantra",
  "Pentapadu",
  "Pithapuram",
  "Podili",
  "Polaki",
  "Polavaram",
  "Ponduru",
  "Prathipadu",
  "Proddatur",
  "Pulikonda",
  "Pulivendula",
  "Punganur",
  "Puttur",
  "Raghuvapadu",
  "Rajahmundry Urban",
  "Rajahmundry Rural",
  "Rajampet",
  "Rajupalem",
  "Ramachandrapuram",
  "Rampachodavaram",
  "Rapur",
  "Raptadu",
  "Rayachoti",
  "Rayadurg",
  "Rayavaram",
  "Razole",
  "Renigunta",
  "Repalle",
  "Salur",
  "Santhakaviti",
  "Santhanuthalapadu",
  "Sattenapalle",
  "Satyavedu",
  "Seethampeta",
  "Seethanagaram",
  "Siddavatam",
  "Singanamala",
  "Sirvel",
  "Somandepalle",
  "Sompeta",
  "Sriharikota",
  "Srikakulam",
  "Srikalahasti",
  "Sullurpeta",
  "Tadepalligudem",
  "Tadikonda",
  "Tadipatri",
  "Tanuku",
  "Tangutur",
  "Tenali",
  "Thulluru",
  "Tirupati Rural",
  "Tirupati Urban",
  "Tiruvuru",
  "Tuni",
  "Udayagiri",
  "Uppalaguptam",
  "Uravakonda",
  "Vadamalapeta",
  "Vajjireddigudem",
  "Vallur",
  "Vamsadhara",
  "Vemulawada",
  "Vempalle",
  "Venkatagiri",
  "Vinukonda",
  "Visakhapatnam Rural",
  "Vissannapeta",
  "Vizianagaram",
  "Vuyyuru",
  "Wanaparthy",
  "Yadamari",
  "Yeleswaram",
  "Yemmiganur",
  "Yerragondapalem",
  "Yerraguntla",
  "Y.S.R. Kadapa",
  "Zarugumilli",
  "Other"
];

const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim()

const normalizeKey = (value) => normalizeText(value).toLowerCase()

const dedupeStrings = (values = []) => {
  const seen = new Set()
  const result = []

  values.forEach((value) => {
    const text = normalizeText(value)
    const key = normalizeKey(text)

    if (!text || seen.has(key)) {
      return
    }

    seen.add(key)
    result.push(text)
  })

  return result
}

export const buildLocationLookup = (locations = []) => {
  const districtOptions = []
  const mandalOptions = []
  const mandalsByDistrict = {}
  const districtMap = {}

  locations.forEach((location) => {
    const district = normalizeText(location?.district)
    if (!district) {
      return
    }

    const districtKey = normalizeKey(district)
    const mandals = dedupeStrings(location?.mandals || [])

    districtOptions.push(district)
    mandalOptions.push(...mandals)
    mandalsByDistrict[districtKey] = mandals
    districtMap[districtKey] = {
      district,
      mandals,
    }
  })

  return {
    districtOptions: [...dedupeStrings([...districtOptions, ...apDistricts.filter((item) => item !== 'Other')]), 'Other'],
    mandalOptions: [...dedupeStrings([...mandalOptions, ...apMandals.filter((item) => item !== 'Other')]), 'Other'],
    mandalsByDistrict,
    districtMap,
  }
}

export const fetchLocationLookup = async () => {
  const response = await apiClient.get('/api/subadmin/management/district-locations')
  const locations = Array.isArray(response?.data?.data) ? response.data.data : []
  return buildLocationLookup(locations)
}

export const getMandalsForDistrict = async (district) => {
  const districtName = normalizeText(district)

  if (!districtName) {
    return []
  }

  const response = await apiClient.get(
    `/api/subadmin/management/district-locations/${encodeURIComponent(districtName)}/mandals`
  )

  return Array.isArray(response?.data?.data?.mandals) ? response.data.data.mandals : []
}

export { normalizeKey }
