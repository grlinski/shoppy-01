import { View, Text, Image, StyleSheet } from 'react-native'



interface BannerProps {
  title: string
  description?: string
}

export default function Banner({ title, description }: BannerProps) {
  return (
    <View style={styles.banner}>
      <Image
        source={require('./assets/temp.jpg')}
        style={styles.bannerImage}
        resizeMode="cover"
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 200,
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
  },
})