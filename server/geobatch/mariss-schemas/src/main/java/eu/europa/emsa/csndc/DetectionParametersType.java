//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, vJAXB 2.1.10 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2014.06.13 at 10:49:44 AM CEST 
//

package eu.europa.emsa.csndc;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

/**
 * Set of parameters calculated for the target during the vessel detection
 * 
 * <p>
 * Java class for DetectionParametersType complex type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="DetectionParametersType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="RCS" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="maxPixelValue" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "DetectionParametersType", propOrder = { "rcs", "maxPixelValue" })
public class DetectionParametersType {

    @XmlElement(name = "RCS")
    protected double rcs;

    protected double maxPixelValue;

    /**
     * Gets the value of the maxPixelValue property.
     * 
     */
    public double getMaxPixelValue() {
        return maxPixelValue;
    }

    /**
     * Gets the value of the rcs property.
     * 
     */
    public double getRCS() {
        return rcs;
    }

    /**
     * Sets the value of the maxPixelValue property.
     * 
     */
    public void setMaxPixelValue(double value) {
        this.maxPixelValue = value;
    }

    /**
     * Sets the value of the rcs property.
     * 
     */
    public void setRCS(double value) {
        this.rcs = value;
    }

}