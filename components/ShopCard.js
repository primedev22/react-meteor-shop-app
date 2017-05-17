import React from 'react';
import { View, ScrollView, Image, Text, Platform, Button, StyleSheet, TouchableOpacity, ListView, RefreshControl } from 'react-native';
import { Icon, Card } from 'react-native-elements';
import { stylesConfig, colorConfig, DEFAULT_SHOP_IMAGE } from '../modules/config';
import { getPriorityLevel, timeAgo } from '../modules/helpers';
import { Flex } from 'antd-mobile';

const { basicHeaderStyle, boldFont, titleStyle, regularFont } = stylesConfig;



const styles = StyleSheet.create({
	groupBadge: {
		height: 9, 
		width: 9,
		marginRight: 5, 
		borderRadius: 50,
	},
	cardHeader: {
		margin: 0, 
		color: '#4b5658', 
		fontSize: 20,
		fontFamily: boldFont
	},
	cardSubHeader: {
		margin: 0, 
		color: '#888', 
		fontSize: 17,
		fontFamily: regularFont
	},
	messageValue: {
		color: '#7b8b8e', 
		fontSize: 13
	}
});



const CardDescription = ({ item, navigation }) => {
	return (
		<Flex align='start' style={{marginBottom: 20}}>
			
			<Flex.Item style={{flex: 3}}>
					
					<Text style={styles.cardHeader}>{item.title}</Text>
					{/*<Text style={styles.cardSubHeader}>{getPriorityLevel(item.priorityLevel)}</Text>*/}
					<View style={{marginTop: 20}}>
						<Text
							ellipsizeMode='tail'
							numberOfLines={5}
							style={styles.description}
						>
							{item.description}
						</Text>
					</View>
			</Flex.Item>
			
			<Flex.Item>
				<Text style={{color: '#888', fontSize: 10}}>
					{item.owner.profile && item.owner.profile.firstName || ''} 
					{item.owner.profile && item.owner.profile.lastName || ''}
				</Text>
			</Flex.Item>
		</Flex>
	);
}

const CardBottom = ({item}) => {
	return (
		<View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'flex-end', justifyContent: 'flex-start'}}>
			<Icon name='label-outline' iconStyle={{ fontSize: 13, marginRight: 5, color: '#bdc3c7' }} />
			<Text style={{ fontSize: 13, color: '#bdc3c7' }}>
				{item.category || ''}
			</Text>
		</View>
	);
}


const ShopCard = ({ item, navigation }) => {
	const onCardPress = () => {
		//if location exists, go to map, if not, do not go to map
		navigation.navigate('shopDetail', { _id: item._id, shopTitle: item.title });
	}
	return (
		<Card containerStyle={{minWidth: 250, padding: 0}}>
			<TouchableOpacity onPress={ ()=>onCardPress() } activeOpacity={0.9}>
				<Image 
					source={{ uri: item.image || DEFAULT_SHOP_IMAGE }} 
					style={{flex: 1, minHeight: 150}}
				/>
				<View style={{flex: 2, padding: 10}}>
					<CardDescription item={item}  navigation={navigation} />
					<CardBottom item={item}  />
				</View>
			</TouchableOpacity>
		</Card>
	);
}

export default ShopCard;