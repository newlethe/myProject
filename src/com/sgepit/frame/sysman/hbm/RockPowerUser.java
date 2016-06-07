package com.sgepit.frame.sysman.hbm;
import java.io.Serializable;

public class RockPowerUser implements Serializable {

	private RockPowerUserId id;
    private int showOrder;
    

    /** full constructor */
    public RockPowerUser(RockPowerUserId id, Integer showOrder) {
        this.id = id;
        this.showOrder = showOrder;
    }

    /** default constructor */
    public RockPowerUser() {
    }

	/**
	 * @return the id
	 */
	public RockPowerUserId getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(RockPowerUserId id) {
		this.id = id;
	}

	/**
	 * @return the showOrder
	 */
	public int getShowOrder() {
		return showOrder;
	}

	/**
	 * @param showOrder the showOrder to set
	 */
	public void setShowOrder(int showOrder) {
		this.showOrder = showOrder;
	}

}
