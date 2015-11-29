package com.sgepit.frame.guideline.hbm;

import java.util.Date;

/**
 * SgccGuidelineInfoXd entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SgccGuidelineInfoXd implements java.io.Serializable {

	// Fields

	private SgccGuidelineInfoXdId id;
	private Date xdsj;

	// Constructors

	/** default constructor */
	public SgccGuidelineInfoXd() {
	}

	/** minimal constructor */
	public SgccGuidelineInfoXd(SgccGuidelineInfoXdId id) {
		this.id = id;
	}

	/** full constructor */
	public SgccGuidelineInfoXd(SgccGuidelineInfoXdId id, Date xdsj) {
		this.id = id;
		this.xdsj = xdsj;
	}

	// Property accessors

	public SgccGuidelineInfoXdId getId() {
		return this.id;
	}

	public void setId(SgccGuidelineInfoXdId id) {
		this.id = id;
	}

	public Date getXdsj() {
		return this.xdsj;
	}

	public void setXdsj(Date xdsj) {
		this.xdsj = xdsj;
	}

}