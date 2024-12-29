
import { Card, CardContent, CardOverflow, Divider, Typography } from "@mui/joy"
import { PropertycardProps } from "./Propertycard.types"

const Propertycard: React.FC<PropertycardProps> = ({ name, location, zoning, price }) => {
    
    
    return (
        <Card variant="outlined" sx={{width:1/2}} onClick={() => console.log("clicked")}>
            <CardContent>
                <Typography level="title-lg" fontWeight="xl">
                    {name}
                </Typography>
                <Typography level="title-md">
                    {zoning}
                </Typography>
                <Typography level="body-md">
                    {location}
                </Typography>
            </CardContent>
            <CardOverflow variant="soft">
                <Divider inset="context"/>
                <Typography level="body-md" py={1}>
                    {price}
                </Typography>
            </CardOverflow>
        </Card>
    )
}

export default Propertycard