package com.sgepit.frame.sysman.hbm;
import java.io.Serializable;
import java.sql.Blob;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

public class SgccAttachBlob implements Serializable {

	private static final long serialVersionUID = 1L;
	private String fileLsh;
    private Blob fileNr;
    

    /** full constructor */
    public SgccAttachBlob(String fileLsh, Blob fileNr) {
        this.fileLsh = fileLsh;
        this.fileNr = fileNr;
    }

    /** default constructor */
    public SgccAttachBlob() {
    }

    /** minimal constructor */
    public SgccAttachBlob(String fileLsh) {
        this.fileLsh = fileLsh;
    }

    public String getFileLsh() {
        return this.fileLsh;
    }

    public void setFileLsh(String fileLsh) {
        this.fileLsh = fileLsh;
    }


    public String toString() {
        return new ToStringBuilder(this)
            .append("fileLsh", getFileLsh())
            .toString();
    }

    public boolean equals(Object other) {
        if ( !(other instanceof SgccAttachBlob) ) return false;
        SgccAttachBlob castOther = (SgccAttachBlob) other;
        return new EqualsBuilder()
            .append(this.getFileLsh(), castOther.getFileLsh())
            .isEquals();
    }
    public int hashCode() {
        return new HashCodeBuilder()
            .append(getFileLsh())
            .toHashCode();
    }


	public Blob getFileNr() {
		return fileNr;
	}

	public void setFileNr(Blob fileNr) {
		this.fileNr = fileNr;
	}

}
