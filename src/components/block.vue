<template>
  <div>
    <b-card>
      <template slot='header'>
        <h5>Block {{blockIndex + 1}}</h5>
        <h6 class='text-secondary'>{{(blockMessage["postWrittenTime"])}}</h6>
      </template>
      <div class='card-text'>
        <p>author: <span class='text-danger'>{{blockMessage['postWriter']['authorName']}}</span></p>
        <p>message: <span class='text-secondary'>{{blockMessage['postMessage']}}</span></p>
        <p>hash: <span class='text-secondary'>{{blockMessage['postBoardSig']['message'][0]['message']}}</span></p>
        <p>author-signed hash: <span class='text-secondary'>{{blockMessage['postWriter']}}</span></p>
        <p>board timestamp: <span class='text-secondary'>{{blockMessage['postBoardSig']['message'][1]}}</span></p>
        <p>board-signed hash: <span class='text-secondary'>{{blockMessage['postBoardSig']}}</span></p>
        <br><br>
  
      </div>
    </b-card>
  </div>
  
</template>

<script>
import moment from 'moment'
/**
 * Displays a single, verifiable block in the block chain.
 * Information included = {
 *  author-written time t_a,
 *  author a ??,
 *  message m,
 *  hash h_i = (m, t_a, a, h_{i-1})
 *  author signature s_a,
 *  board-written time t_b,
 *  board_sig s_b = signed(s_a, t_b),
 *  ballot image img,
 *  human-readable summary of the message (parsed json) ??
 * }
 */
export default {
  name: 'Block',
  // NOTE: NEED TO ADD VALIDATION FOR THE FORMAT OF 'blockMessage'
  props: ['blockMessage', 'blockIndex'],
  data: () => {
    return {
      t_a: moment("2018-11-19T12:00:00"),
      a: 'Nate',
      m: 'MSG_JSON',
      h_i: 'HASH',
      s_a: 'SIG_a(HASH_i)',
      t_b: moment("2018-11-19T12:01:00"),
      s_b: 'SIG_b(s_a, t_b)',
      img: 'SRC'
    }
  }
}
</script>

<style lang='scss'>
</style>
