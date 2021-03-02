<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" />

  <xsl:template match="/">
    <select id="theList">
      <xsl:apply-templates select="*" />
    </select>
  </xsl:template>

  <xsl:template match="document">
    <option><xsl:attribute name="value"><xsl:value-of select="location" /></xsl:attribute><xsl:value-of select="description" /></option>
  </xsl:template>

</xsl:stylesheet>
