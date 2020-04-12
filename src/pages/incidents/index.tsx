import React, { useEffect, useState } from 'react'
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import styles from './style'
import logo from '../../assets/logo.png'
import * as api from '../../services/api'

export default function Incidents() {
    const [incidents, setIncidents] = useState([])
    const [totalIncidents, setTotalIncidents] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    function navigateToDetail(incident: any) {
        navigation.navigate('Details', {incident})
    }

    async function loadIncidents() {
        if(loading) return
        if(totalIncidents > 0 && incidents.length === totalIncidents) return

        setLoading(true)

        const apiResponse = await api.loadIncidents(page)


        setIncidents(incidents.concat(apiResponse.data))
        setTotalIncidents(apiResponse.headers['x-total-count'])

        setPage(page + 1)
        setLoading(false)
    }

    useEffect(() => {
        loadIncidents()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logo}></Image>
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{totalIncidents} casos</Text>.
                </Text>
            </View>
            <Text style={styles.title}>Bem Vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia!</Text>

            <FlatList onEndReached={loadIncidents} onEndReachedThreshold={0.2} data={incidents} style={styles.incidentsList} keyExtractor={(incident: any) => String(incident.id)} renderItem={({ item: incident }) =>
                (
                    <View style={styles.incident}>
                        <Text style={styles.incidentProperty}>ONG:</Text>
                        <Text style={styles.incidentValue}>{incident.name}</Text>

                        <Text style={styles.incidentProperty}>CASO:</Text>
                        <Text style={styles.incidentValue}>{incident.title}</Text>

                        <Text style={styles.incidentProperty}>VALOR:</Text>
                        <Text style={styles.incidentValue}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(incident.value)}</Text>

                        <TouchableOpacity style={styles.detailButton} onPress={() => navigateToDetail(incident)}>
                            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                            <Feather name='arrow-right' size={16} color='#E02041'></Feather>
                        </TouchableOpacity>
                    </View>
                )
            }></FlatList>
        </View>
    )
}