
import { Card, CardContent, CardOverflow, Divider, Typography } from "@mui/joy"
import { PropertycardProps } from "./Propertycard.types"

const Propertycard: React.FC<PropertycardProps> = ({ location, type, valuation }) => {
    
    
    return (
        <Card variant="outlined" sx={{width:1/2}} onClick={() => console.log("clicked")}>
            <CardContent>
                <Typography level="title-lg">
                    {type}
                </Typography>
                <Typography level="body-md">
                    {location}
                </Typography>
            </CardContent>
            <CardOverflow variant="soft">
                <Divider inset="context"/>
                <Typography level="body-md" py={1}>
                    {valuation.slice(-1)[0]}
                </Typography>
            </CardOverflow>
        </Card>
    )
}

export default Propertycard